import { Input, Button } from "@/components/atoms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { PickCreatePlaylist } from "@repo";
import { Plus } from "lucide-react";

interface PlayListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleAdd: (e: React.FormEvent) => void;
  formCreatePlaylistMusic: PickCreatePlaylist;
  setFormCreatePlaylistMusic: React.Dispatch<
    React.SetStateAction<PickCreatePlaylist>
  >;
  isPending: boolean;
}

const PlaylistModal: React.FC<PlayListModalProps> = ({
  onOpenChange,
  open,
  formCreatePlaylistMusic,
  handleAdd,
  setFormCreatePlaylistMusic,
  isPending,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="ghibli-glass sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg font-semibold">
            Playlist Baru
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAdd} className="flex w-full flex-col gap-4 pt-2">
          <div className="flex w-full flex-col gap-3">
            <Input
              placeholder="Nama playlist"
              value={formCreatePlaylistMusic.name}
              onChange={(e) =>
                setFormCreatePlaylistMusic((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-input bg-background/80 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
              disabled={isPending}
            />

            <Input
              placeholder="Keterangan"
              value={formCreatePlaylistMusic.description}
              onChange={(e) =>
                setFormCreatePlaylistMusic((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-input bg-background/80 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              size="sm"
              className="flex h-9 items-center gap-2 px-4"
              disabled={
                isPending ||
                !formCreatePlaylistMusic.name.trim() ||
                !formCreatePlaylistMusic.description.trim()
              }
            >
              <Plus className="size-4" />
              <span>Buat</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistModal;
