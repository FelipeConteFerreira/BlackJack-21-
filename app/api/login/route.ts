import { NextRequest, NextResponse } from 'next/server'

type LoginBody = { username?: string, password?: string }

export async function POST(req: NextRequest){
  try{
    const body: LoginBody = await req.json()
    const secret = process.env.API_SECRET || ''
    if(!body.password || body.password !== secret){
      return NextResponse.json({ message: 'Senha inválida' }, { status: 401 })
    }
    const token = Buffer.from(`${body.username}:${Date.now()}`).toString('base64')
    return NextResponse.json({ access_token: token })
  }catch(err){
    return NextResponse.json({ message: 'Erro no servidor' }, { status: 500 })
  }
}
