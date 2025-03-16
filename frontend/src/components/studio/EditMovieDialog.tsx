import type React from "react";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Movie } from "./type/movie";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import NotificationToast from "../ui/NotificationToast";
import DOMPurify from "dompurify";

interface EditMovieDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movie: Movie | null;
  isCreating: boolean;
  onSave: (movie: Movie) => void;
}

export function EditMovieDialog({
  open,
  onOpenChange,
  movie,
  isCreating,
  onSave,
}: EditMovieDialogProps) {
  const [formData, setFormData] = useState<Movie>({
    id: "",
    name: "",
    description: "",
    pathImg: "",
  });

  useEffect(() => {
    if (movie) {
      setFormData(movie);
    } else {
      setFormData({
        id: "",
        name: "",
        description: "",
        pathImg:
          "https://kzmfrsx9ehwj2a5v23wk.lite.vusercontent.net/placeholder.svg?height=400&width=300",
      });
    }
  }, [movie, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "year" ? Number.parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedData = {
      id: "",
      name: DOMPurify.sanitize(formData.name),
      description: DOMPurify.sanitize(formData.description),
      pathImg: DOMPurify.sanitize(formData.pathImg),
    };

    try {
      console.log(sanitizedData);

      // ตั้งสถานะการสร้างหรืออัปเดต
      let response;
      if (isCreating) {
        response = await axiosInstance.post("/movies", sanitizedData);
      } else {
        response = await axiosInstance.patch(
          `/movies/${movie?.id}`,
          sanitizedData
        );
      }

      // เช็กสถานะ HTTP ของคำขอ
      if (response.status === 201 || response.status === 200) {
        console.log("Movie saved successfully", response.data);
        toast.success(
          isCreating
            ? "Movie created successfully!"
            : "Movie updated successfully!"
        );
      } else {
        toast.warning(
          isCreating ? "Failed to create movie" : "Failed to save changes"
        );
        console.error("Failed to save movie:", response.statusText);
      }

      // เรียกใช้ onSave หลังจากบันทึกข้อมูลสำเร็จ
      onSave(sanitizedData);
    } catch (error) {
      toast.error("Error submitting form.");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-black">
              {isCreating ? "Add New Movie" : "Edit Movie"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="text-black">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="pathImg"
                  name="pathImg"
                  value={formData.pathImg}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {isCreating ? "Create" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <NotificationToast />
    </>
  );
}
