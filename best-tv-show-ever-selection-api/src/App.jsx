import { useState } from 'react'
import './App.css'
import ChannelSelect from './components/ChannelSelect'
import ShowSelection from './components/ShowSelection'

const modes = [
  { id: 'classic', channel: '01', label: 'Classic', eyebrow: 'The full schedule', description: 'Build a six-show lineup from random genre and decade combinations spanning the 1950s through today.', rotation: -42 },
  { id: 'channel', channel: '02', label: 'Channel Mode', eyebrow: 'Pick your signal', description: 'Choose Broadcast, Premium, or Streaming, then build the strongest six-show lineup from that group.', rotation: 0 },
  { id: 'daily', channel: '03', label: 'Daily Challenge', eyebrow: 'One showtime. One shot.', description: 'Play the same themed challenge as everyone else today. Six picks, no rerolls, and no second chances.', rotation: 42 },
]

function Home({ onStart }) {
  const [selectedMode, setSelectedMode] = useState('classic')
  const [previewMode, setPreviewMode] = useState(null)
  const activeMode = modes.find((mode) => mode.id === (previewMode ?? selectedMode))
  const selectMode = (id) => { setSelectedMode(id); setPreviewMode(null) }

  return <main className="site-shell">
    <div className="signal-glow signal-glow--one" aria-hidden="true" /><div className="signal-glow signal-glow--two" aria-hidden="true" />
    <header className="hero"><p className="hero__kicker">Tonight's feature presentation</p><h1>Best TV Show <span>Ever</span></h1><p className="hero__tagline">Build the ultimate TV lineup.</p></header>
    <section className="tuner" aria-labelledby="choose-mode-heading">
      <div className="tuner__screen"><div className="screen__noise" aria-hidden="true" /><p className="screen__channel">CH {activeMode.channel}</p><div className="screen__content"><p className="screen__eyebrow">{activeMode.eyebrow}</p><h2 id="choose-mode-heading">{activeMode.label}</h2><p className="screen__description">{activeMode.description}</p><button className="start-button" type="button" onClick={() => onStart(selectedMode)}>Start {activeMode.label}</button></div></div>
      <div className="tuner__controls"><p className="controls__label">Select a channel</p><div className="dial-area" aria-label="Channel dial">
        {modes.map((mode, index) => <button key={mode.id} type="button" className={`dial-number dial-number--${['one', 'two', 'three'][index]}${selectedMode === mode.id ? ' is-selected' : ''}`} aria-label={`Channel ${index + 1}: ${mode.label}`} aria-pressed={selectedMode === mode.id} onMouseEnter={() => setPreviewMode(mode.id)} onMouseLeave={() => setPreviewMode(null)} onFocus={() => setPreviewMode(mode.id)} onBlur={() => setPreviewMode(null)} onClick={() => selectMode(mode.id)}>{index + 1}</button>)}
        <div className="dial-track" aria-hidden="true"><div className="dial" style={{ '--dial-rotation': `${activeMode.rotation}deg` }}><span className="dial__pointer" /><span className="dial__center" /></div></div>
      </div><div className="mode-list" aria-label="Game modes">{modes.map((mode) => <button key={mode.id} type="button" className={`mode-button${selectedMode === mode.id ? ' is-selected' : ''}`} aria-pressed={selectedMode === mode.id} onMouseEnter={() => setPreviewMode(mode.id)} onMouseLeave={() => setPreviewMode(null)} onFocus={() => setPreviewMode(mode.id)} onBlur={() => setPreviewMode(null)} onClick={() => selectMode(mode.id)}><span className="mode-button__channel">{mode.channel}</span><span>{mode.label}</span></button>)}</div></div>
    </section><footer><p>Six shows. Eight choices each round. One unbeatable lineup.</p></footer>
  </main>
}

export default function App() {
  const [screen, setScreen] = useState('home'); const [mode, setMode] = useState(null); const [channelGroup, setChannelGroup] = useState(null)
  const goHome = () => { setScreen('home'); setMode(null); setChannelGroup(null) }
  const start = (nextMode) => { setMode(nextMode); setScreen(nextMode === 'channel' ? 'channels' : 'selection') }
  if (screen === 'channels') return <ChannelSelect onBack={goHome} onSelect={(group) => { setChannelGroup(group); setScreen('selection') }} />
  if (screen === 'selection') return <ShowSelection mode={mode} channelGroup={channelGroup} onExit={goHome} />
  return <Home onStart={start} />
}
