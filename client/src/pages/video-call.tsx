import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useRoute } from 'wouter';
import { VideoCall } from '@/components/video-call';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function VideoCallPage() {
  const [, params] = useRoute('/meeting/:sessionId');
  const [, setLocation] = useLocation();
  const sessionId = params?.sessionId;

  const { data: user } = useQuery<any>({
    queryKey: ['/api/users/current'],
  });

  const { data: meetingRoom, isLoading: roomLoading, error } = useQuery<any>({
    queryKey: ['/api/sessions', sessionId, 'meeting-room'],
    enabled: !!sessionId,
  });

  const { data: session } = useQuery<any>({
    queryKey: ['/api/sessions', sessionId],
    enabled: !!sessionId,
  });

  const handleEndCall = () => {
    setLocation('/');
  };

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Invalid Meeting Room</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">The meeting room link is invalid.</p>
            <Button onClick={() => setLocation('/')} data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (roomLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Joining Meeting...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading meeting room</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !meetingRoom) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Meeting Room Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              The meeting room doesn't exist or the session hasn't started yet.
            </p>
            <Button onClick={() => setLocation('/')} data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">You need to be logged in to join the meeting.</p>
            <Button onClick={() => setLocation('/')} data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isHost = user.id === meetingRoom.hostId;
  const isParticipant = meetingRoom.participants?.includes(user.id) || isHost;

  if (!isParticipant) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              You are not enrolled in this session. Please join the session first to access the meeting room.
            </p>
            <Button onClick={() => setLocation('/browse')} data-testid="button-browse-sessions">
              Browse Sessions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <VideoCall
      meetingRoomId={meetingRoom.meetingRoomId}
      sessionTitle={meetingRoom.sessionTitle}
      isHost={isHost}
      userId={user.id}
      onEndCall={handleEndCall}
    />
  );
}