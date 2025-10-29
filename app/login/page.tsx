'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type LoginRequest = { username: string, password: string }

export default function LoginPage(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent){
    e.preventDefault()
    setError(null)
    const payload: LoginRequest = { username, password }
    try{
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      })
      if(!res.ok){
        const err = await res.json()
        setError(err.message || 'Erro ao logar')
        return
      }
      const data = await res.json()
      // store token
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('username', username)
      router.push('/blackjack')
    }catch(err:any){
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="header">
        <h1>Simulador de Blackjack</h1>
        <p className="small">Faça login para começar</p>
      </div>

      <div style={{display:'flex', justifyContent:'center'}}>
        <form onSubmit={handleLogin} className="box" style={{minWidth:360}}>
          <label className="small">Usuário</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} style={{padding:8, margin:'8px 0', width:'100%'}} required />

          <label className="small">Senha</label>
          <input value={password} type="password" onChange={e=>setPassword(e.target.value)} style={{padding:8, margin:'8px 0', width:'100%'}} required />

          <div className="controls">
            <button type="submit" className="btn-primary">Login</button>
          </div>
          {error && <p style={{color:'#ffb4b4', marginTop:8}}>{error}</p>}
        </form>
      </div>
    </div>
  )
}
