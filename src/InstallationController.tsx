import { useState } from "react";
import { List } from "@chakra-ui/react";

import { useInstallable } from "@/providers/installable/useInstallable.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  DialogBackdrop,
  DialogBody,
  DialogActionTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { toaster } from "@/components/ui/toaster.tsx";

import pwaLogo from "/pwa-logo.svg";

export function InstallationController() {
  const [isModalOpened, setModalOpened] = useState(false);
  const [isInstalling, setInstalling] = useState(false);

  const { event } = useInstallable();

  const handleInstall = async () => {
    setInstalling(true);
    const response = await event?.prompt();
    setInstalling(false);
    if (response?.outcome === "accepted") {
      toaster.success({
        title: "Success!",
        description: "You can now access application from home screen",
      });
      setModalOpened(false);
    }
  };

  return (
    <>
      <div className="install-container">
        <span>Use our app for better experience</span>
        <DialogRoot
          placement="center"
          open={isModalOpened}
          onOpenChange={({ open }) => setModalOpened(open)}
        >
          <DialogBackdrop />
          <DialogTrigger asChild>
            <Button colorPalette="purple">Check the benefits</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="dialog-header">
              <img width="32" height="32" src={pwaLogo} alt="App Logo" />
              <h3>Using application</h3>
            </DialogHeader>
            <DialogBody>
              <div className="dialog-description">
                <p>Have you tried using our standalone application?</p>
                <p>
                  It can further improve you experience with features such as:
                </p>
              </div>
              <List.Root variant="plain" className="dialog-list">
                <List.Item>
                  <List.Indicator>🚀</List.Indicator>
                  <span>
                    <b>Fast loading</b>: page loading is approximately 1.5x
                    faster
                  </span>
                </List.Item>
                <List.Item>
                  <List.Indicator>🌐</List.Indicator>
                  <span>
                    <b>Offline-ready</b>: Can work offline
                  </span>
                </List.Item>
                <List.Item>
                  <List.Indicator>🔔</List.Indicator>
                  <span>
                    <b>Notifications</b>: Allows to set notification for things
                    that really matters
                  </span>
                </List.Item>
                <List.Item>
                  <List.Indicator>⬇️</List.Indicator>
                  <span>
                    <b>Background tasks</b>: Continue downloading large files
                    event when app is collapsed
                  </span>
                </List.Item>
                <List.Item ml="1rem">
                  <a href="https://whatpwacando.today/">....and many others!</a>
                </List.Item>
              </List.Root>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogActionTrigger>
              <Button
                colorPalette="purple"
                onClick={handleInstall}
                loading={isInstalling}
              >
                Proceed to installation
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </div>
    </>
  );
}
