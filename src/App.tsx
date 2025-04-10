import React from "react"
import MediaPlayer from "./assets/components/MediaPlayer"

const App: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Reproductor Multimedia con React y Tailwind CSS
      </h1>

      <div className="space-y-8">
        <MediaPlayer
          type="video"
          src="../public/Bola de Drac Z - Opening Català (v2) HD 720p (Subtítols-Karaoke).mp4"
          title="Dragon ball en catalan - Video de muestra"
          muted={true}
        />

        <MediaPlayer
          type="audio"
          src="../public/Bola de Drac Z - Opening Català (v2) HD 720p (Subtítols-Karaoke).mp3"
          title="SoundHelix Song 1 - Audio de muestra"
        />
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        <h2 className="font-semibold mb-2">Atribuciones:</h2>
        <p>Bola de Drac Z - Opening Català (v2) HD 720p (Subtítols-Karaoke)</p>
      
      </div>
    </div>
  )
}

export default App
