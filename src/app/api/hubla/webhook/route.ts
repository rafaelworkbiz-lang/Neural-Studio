import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const headersList = await headers()
    
    // Verificar webhook secret da Hubla
    const webhookSecret = headersList.get('x-hubla-signature')
    const expectedSecret = process.env.HUBLA_WEBHOOK_SECRET
    
    if (!expectedSecret || webhookSecret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extrair dados do webhook da Hubla
    const { email, status, customer_name } = body
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Verificar se é uma compra aprovada
    if (status !== 'approved' && status !== 'paid') {
      return NextResponse.json({ message: 'Payment not approved yet' }, { status: 200 })
    }

    const adminClient = createAdminClient()

    // Verificar se o usuário já existe
    const { data: existingUser, error: getUserError } = await adminClient.auth.admin.getUserByEmail(email)

    if (existingUser.user) {
      // Usuário já existe, apenas garantir que está ativo
      console.log(`Usuário ${email} já existe, mantendo ativo`)
      
      // Atualizar metadados se necessário
      await adminClient.auth.admin.updateUserById(existingUser.user.id, {
        user_metadata: {
          ...existingUser.user.user_metadata,
          customer_name,
          hubla_purchase: true,
          purchase_date: new Date().toISOString()
        }
      })
      
      return NextResponse.json({ 
        message: 'User already exists and is active',
        user_id: existingUser.user.id 
      })
    }

    // Criar novo usuário via invite
    const { data: newUser, error: createError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: {
        customer_name,
        hubla_purchase: true,
        purchase_date: new Date().toISOString()
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`
    })

    if (createError) {
      console.error('Erro ao criar usuário:', createError)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    console.log(`Novo usuário criado: ${email}`)
    
    return NextResponse.json({ 
      message: 'User created successfully',
      user_id: newUser.user?.id 
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}