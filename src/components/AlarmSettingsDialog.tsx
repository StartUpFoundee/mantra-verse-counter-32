
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Bell, Volume2 } from 'lucide-react';

interface AlarmSettingsDialogProps {
  children: React.ReactNode;
}

const AlarmSettingsDialog: React.FC<AlarmSettingsDialogProps> = ({ children }) => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [volume, setVolume] = React.useState([50]);
  const [interval, setInterval] = React.useState([108]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-600" />
            Alarm Settings
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="alarm-enabled" className="text-sm font-medium">
              Enable Completion Alert
            </Label>
            <Switch
              id="alarm-enabled"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>
          
          {isEnabled && (
            <>
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Volume: {volume[0]}%
                </Label>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Alert every {interval[0]} jaaps
                </Label>
                <Slider
                  value={interval}
                  onValueChange={setInterval}
                  min={50}
                  max={500}
                  step={1}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlarmSettingsDialog;
