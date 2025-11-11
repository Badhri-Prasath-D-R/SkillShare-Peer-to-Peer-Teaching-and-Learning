import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, Users, Phone, Settings } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface VideoCallProps {
  meetingRoomId: string;
  sessionTitle: string;
  isHost: boolean;
  userId: string;
  onEndCall: () => void;
}

interface Participant {
  id: string;
  username: string;
  stream?: MediaStream;
}

export function VideoCall({ meetingRoomId, sessionTitle, isHost, userId, onEndCall }: VideoCallProps) {
  const { toast } = useToast();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallStarted, setIsCallStarted] = useState(false);

  // Initialize local media stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsCallStarted(true);
        
        toast({
          title: "Video call ready",
          description: "Your camera and microphone are connected.",
        });
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast({
          title: "Media access failed",
          description: "Unable to access camera or microphone. Please check permissions.",
          variant: "destructive",
        });
      }
    };

    initializeMedia();

    return () => {
      // Clean up media stream when component unmounts
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold" data-testid="video-call-title">
            {sessionTitle}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="bg-green-600">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Live Session
            </Badge>
            <span className="text-sm text-gray-300">Room: {meetingRoomId}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <span className="text-sm">{participants.length + 1} participants</span>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Local Video */}
        <Card className="bg-gray-800 border-gray-700 relative">
          <CardContent className="p-0 relative aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover rounded-lg"
              data-testid="local-video"
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center rounded-lg">
                <VideoOff className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 px-2 py-1 rounded text-white text-sm">
              You {isHost && "(Host)"}
            </div>
            <div className="absolute top-2 right-2 flex gap-1">
              {!isAudioEnabled && (
                <div className="bg-red-600 p-1 rounded">
                  <MicOff className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for other participants */}
        {participants.length === 0 && (
          <Card className="bg-gray-800 border-gray-700 border-dashed">
            <CardContent className="p-8 flex flex-col items-center justify-center aspect-video text-gray-400">
              <Users className="w-12 h-12 mb-4" />
              <p className="text-center">
                {isHost 
                  ? "Waiting for participants to join..." 
                  : "Connecting to other participants..."
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Remote participants would be rendered here */}
        {participants.map((participant) => (
          <Card key={participant.id} className="bg-gray-800 border-gray-700 relative">
            <CardContent className="p-0 relative aspect-video">
              <video
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 px-2 py-1 rounded text-white text-sm">
                {participant.username}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4 flex justify-center gap-4">
        <Button
          variant={isAudioEnabled ? "secondary" : "destructive"}
          size="lg"
          onClick={toggleAudio}
          className="rounded-full w-12 h-12 p-0"
          data-testid="button-toggle-audio"
        >
          {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </Button>
        
        <Button
          variant={isVideoEnabled ? "secondary" : "destructive"}
          size="lg"
          onClick={toggleVideo}
          className="rounded-full w-12 h-12 p-0"
          data-testid="button-toggle-video"
        >
          {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </Button>
        
        <Button
          variant="secondary"
          size="lg"
          className="rounded-full w-12 h-12 p-0"
          data-testid="button-settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
        
        <Button
          variant="destructive"
          size="lg"
          onClick={handleEndCall}
          className="rounded-full w-12 h-12 p-0"
          data-testid="button-end-call"
        >
          <Phone className="w-5 h-5 rotate-[135deg]" />
        </Button>
      </div>

      {/* Status Messages */}
      {!isCallStarted && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-center">Connecting to video call...</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Setting up camera and microphone</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}