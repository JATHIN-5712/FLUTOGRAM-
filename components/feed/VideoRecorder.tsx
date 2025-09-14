import React, { useState, useEffect, useRef } from 'react';

interface VideoRecorderProps {
  onClose: () => void;
  onVideoReady: (videoUrl: string) => void;
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({ onClose, onVideoReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleStartRecording = () => {
    if (streamRef.current) {
      setVideoUrl(null);
      setRecordedChunks([]);
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.src = url;
        }
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };
  
  const handleUseVideo = () => {
    if (videoUrl) {
      // Since createObjectURL is temporary, we read it into a more permanent Data URL
      fetch(videoUrl)
        .then(res => res.blob())
        .then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {
                onVideoReady(reader.result as string);
            };
            reader.readAsDataURL(blob);
        });
    }
  };

  const handleRetake = () => {
    setVideoUrl(null);
    if(videoRef.current){
        videoRef.current.src = "";
        videoRef.current.srcObject = streamRef.current;
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-4 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4 text-center">Record Video</h2>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <video ref={videoRef} autoPlay muted playsInline className="w-full rounded-md bg-black"></video>
        )}
        
        <div className="mt-4 flex justify-center items-center space-x-4">
            {!videoUrl && (
                 <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`px-4 py-2 rounded-full font-semibold text-white transition-colors ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                  >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </button>
            )}
            {videoUrl && (
                <>
                    <button onClick={handleUseVideo} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
                      Use Video
                    </button>
                    <button onClick={handleRetake} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
                      Retake
                    </button>
                </>
            )}
           
            <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full">
              Cancel
            </button>
        </div>
      </div>
    </div>
  );
};
