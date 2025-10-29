'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Card = {
  code: string
  image: string
  images?: { svg: string, png: string }
  value: string
  suit: string
}

type DrawResponse = {
  success: boolean
  deck_id: string
  cards: Card[]
  remaining: number
}

export default function BlackjackPage(){
  const router = useRouter()
  const [tokenChecked, setTokenChecked] = useState(false)
  const [username, setUsername] = useState('')
  const [deckId, setDeckId] = useState<string | null>(null)
  const [playerCards, setPlayerCards] = useState<Card[]>([])
  const [dealerCards, setDealerCards] = useState<Card[]>([])
  const [status, setStatus] = useState<'idle'|'playing'|'player_bust'|'dealer_bust'|'player_win'|'dealer_win'|'push'>('idle')

  useEffect(()=>{
    const t = localStorage.getItem('access_token')
    const u = localStorage.getItem('username') || ''
    if(!t){
      router.push('/login')
      return
    }
    setUsername(u)
    setTokenChecked(true)
  }, [router])

  useEffect(()=>{
    if(tokenChecked){
      startNewGame()
    }
  }, [tokenChecked])

  function calcScore(cards: Card[]){
    if(!cards || cards.length === 0) return 0
    let total = 0
    let aces = 0
    for(const c of cards){
      if(!c || !c.value) continue
      if(c.value === 'ACE'){
        aces++
        total += 11
      }else if(['KING','QUEEN','JACK'].includes(c.value)){
        total += 10
      }else{
        total += parseInt(c.value)
      }
    }
    
    while(total > 21 && aces > 0){
      total -= 10
      aces--
    }
    return total
  }

  async function startNewGame(){
    setStatus('playing')
    setPlayerCards([])
    setDealerCards([])
    
    const base = process.env.NEXT_PUBLIC_DECK_API || 'https://deckofcardsapi.com/api'
    const res = await fetch(`${base}/deck/new/shuffle/`)
    const data = await res.json()
    setDeckId(data.deck_id)
    
    const drawRes = await fetch(`${base}/deck/${data.deck_id}/draw/?count=4`)
    const drawData: DrawResponse = await drawRes.json()
    if(!drawData.cards || drawData.cards.length < 4){
      console.error('Não foi possível obter as cartas')
      return
    }
    const [p1,p2,d1,d2] = drawData.cards
    if(!p1 || !p2 || !d1 || !d2){
      console.error('Cartas inválidas recebidas')
      return
    }
    setPlayerCards([p1,p2])
    setDealerCards([d1,d2])
    // check blackjack immediate
    const playerScore = calcScore([p1,p2])
    const dealerScore = calcScore([d1,d2])
    if(playerScore === 21 && dealerScore !== 21){
      setStatus('player_win')
    }else if(dealerScore === 21 && playerScore !== 21){
      setStatus('dealer_win')
    }else if(playerScore === 21 && dealerScore === 21){
      setStatus('push')
    }else{
      setStatus('playing')
    }
  }

  async function playerHit(){
    if(!deckId) return
    const base = process.env.NEXT_PUBLIC_DECK_API || 'https://deckofcardsapi.com/api'
    const res = await fetch(`${base}/deck/${deckId}/draw/?count=1`)
    const data: DrawResponse = await res.json()
    if(!data.cards || !data.cards[0]){
      console.error('Não foi possível obter a carta')
      return
    }
    const card = data.cards[0]
    const newPlayer = [...playerCards, card]
    setPlayerCards(newPlayer)
    const score = calcScore(newPlayer)
    if(score > 21){
      setStatus('player_bust')
    }
  }

  async function playerStand(){
    
    if(!deckId) return
    let dealer = [...dealerCards]
    const base = process.env.NEXT_PUBLIC_DECK_API || 'https://deckofcardsapi.com/api'
    let score = calcScore(dealer)
    while(score < 17){
      const res = await fetch(`${base}/deck/${deckId}/draw/?count=1`)
      const data: DrawResponse = await res.json()
      if(!data.cards || !data.cards[0]){
        console.error('Não foi possível obter a carta do dealer')
        break
      }
      dealer.push(data.cards[0])
      score = calcScore(dealer)
    }
    setDealerCards(dealer)
    const playerScore = calcScore(playerCards)
    if(score > 21){
      setStatus('dealer_bust')
    }else{
      if(playerScore > score) setStatus('player_win')
      else if(playerScore < score) setStatus('dealer_win')
      else setStatus('push')
    }
  }

  if(!tokenChecked) return null

  const playerScore = calcScore(playerCards)
  const dealerScore = (status === 'playing' && dealerCards.length > 0) 
    ? calcScore([dealerCards[0]]) 
    : calcScore(dealerCards)

  return (
    <div>
      <div className="header">
        <h1>Simulador de Blackjack</h1>
        <p className="small">Tente chegar o mais próximo de 21 sem ultrapassar</p>
        <p className="small">Usuário: {username}</p>
      </div>

      <div className="card-grid">
        <div className="box">
          <h3>Jogador</h3>
          <div className="card-row">
            {playerCards.length === 0 && <div className="small">Sem cartas</div>}
            {playerCards.map((c,i)=>(
              <img key={c.code+i} className="card-img" src={c.image} alt={c.code} />
            ))}
          </div>
          <div className="score">Pontuação: {playerScore}</div>
        </div>

        <div className="box">
          <h3>Dealer</h3>
          <div className="card-row">
            {dealerCards.length === 0 && <div className="small">Sem cartas</div>}
            {dealerCards.map((c,i)=>{
              // if playing, hide dealer second card
              if(status === 'playing' && i === 1){
                return <div key={'hidden'} style={{width:80, height:116, borderRadius:6, background:'#111', display:'flex', alignItems:'center', justifyContent:'center', color:'#999'}}>Virada</div>
              }
              return <img key={c.code+i} className="card-img" src={c.image} alt={c.code} />
            })}
          </div>
          <div className="score">Pontuação: {dealerScore}</div>
        </div>
      </div>

      <div className="controls">
        <button className="btn-primary" onClick={playerHit} disabled={status !== 'playing'}>Pedir Carta</button>
        <button className="btn-danger" onClick={playerStand} disabled={status !== 'playing'}>Parar</button>
        <button className="btn-neutral" onClick={startNewGame}>Reiniciar Jogo</button>
        <button className="btn-neutral" onClick={()=>{ localStorage.removeItem('access_token'); router.push('/login') }}>Logout</button>
      </div>

      <div style={{marginTop:18, textAlign:'center'}} className="small">
        {status === 'player_bust' && <div style={{color:'#ffb4b4'}}>Você estourou! Dealer vence.</div>}
        {status === 'dealer_bust' && <div style={{color:'#c8ffd7'}}>Dealer estourou! Você vence.</div>}
        {status === 'player_win' && <div style={{color:'#c8ffd7'}}>Você venceu!</div>}
        {status === 'dealer_win' && <div style={{color:'#ffb4b4'}}>Dealer venceu.</div>}
        {status === 'push' && <div style={{color:'#fff3b0'}}>Empate (push).</div>}
      </div>

      <div style={{marginTop:24, textAlign:'center'}} className="small">
        <div>Powered by Deck of Cards API</div>
        <div>Desenvolvido por Felipe Conte Ferreira</div>
      </div>
    </div>
  )
}
