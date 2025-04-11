import { Box, Stack, Dialog, DialogContent, Button, IconButton, DialogActions, Typography, InputBase } from "@mui/material";
import { useState, useEffect } from "react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from "@mui/styles";

interface FeedbackEditorProps {
  feedback: { content: string; attachments: { id: number; attachment: File; type: "photo" | "video" | "file", filename: string }[] };
  setFeedback: (newFeedback: { content: string; attachments: { id: number; attachment: File; type: "photo" | "video" | "file", filename: string }[] }) => void;
}

const useStyles = makeStyles({
  dialog: {
   overflow: "visible",
   "&": {
      overflow: "visible !important",
    },
  },
});


export default function FeedbackEditor(props: FeedbackEditorProps) {
  const { feedback, setFeedback } = props
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0)
  const classes = useStyles();
  const feedback_attachments = feedback.attachments
  const photos = feedback_attachments.filter(file => file.type == "photo")


  const toggleImageModal = () => {
    setShowImageModal(!showImageModal);
  }

  const openImageModal = (id: number) => {
    setActiveIndex(id)
    setShowImageModal(true);
  }

  const handleRemoveImage = (index: number) => {
    const newList = feedback_attachments.filter((photo) => index !== photo.id);
    setFeedback({...feedback, attachments: newList});
  }
  
  const handleFeedbackContentChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setFeedback({...feedback,content: e.target.value})

  const prevSlide = () => {
    const currentIndex = photos.findIndex(photo => photo.id === activeIndex);
    if (currentIndex === -1) return null; 
    const id = photos[(currentIndex + 1) % photos.length].id;
    setActiveIndex(id)
  }

  const nextSlide = () => {
    const currentIndex = photos.findIndex(photo => photo.id === activeIndex);
    if (currentIndex === -1) return null;
    const id = photos[(currentIndex - 1 + photos.length) % photos.length].id;
    setActiveIndex(id)
  }

  useEffect(() => {
    if (!photos || photos.length === 0) {
      console.log("attachments not available yet.");
      return;
    }

    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "ArrowLeft") prevSlide();
      if (event.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [[photos]]);


  return (
    <Box>
      
      <Box sx={{ boxShadow: 2, px: 2, borderRadius: "6px" }}>
        <InputBase
          fullWidth
          placeholder="Describe the issue in details"
          inputProps={{ 'aria-label': 'feedback comment' }}
          multiline
          autoFocus
          rows={5}
          sx={{fontSize: 14}}
          value={feedback.content} 
          onChange={handleFeedbackContentChange}
        />

        {/* <TextField value={feedback.content} onChange={handleFeedbackContentChange} id="filled-multiline-static" sx={{fontSize: 12}} multiline rows={4} placeholder="Describe the issue in details" variant="standard" fullWidth /> */}
      </Box>
      
      <Box pt={2}>
      {feedback_attachments.map((attachment) => {
          return (
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} spacing={6} pt={1}>
              <Typography variant="body2" fontSize={13}>{attachment.filename}</Typography>
              <Stack gap={1} key={attachment.id} direction={'row'} justifyContent={'flex-end'} alignItems={'center'}>
                {attachment.type == "photo" && <Button size="small" sx={{backgroundColor: "rgba(222, 210, 238, 1)", color: "black", borderRadius: "20px"}} variant="contained" startIcon={<PlayArrowIcon sx={{color: "rgba(96, 36, 216, 1)", mr: 0}} />} onClick={()=>openImageModal(attachment.id)}>Preview</Button>}
                <Button size="small" sx={{backgroundColor: "rgba(255, 227, 227, 1)", color: "rgb(224, 36, 36)", borderRadius: "20px"}} variant="contained" startIcon={<DeleteIcon />} onClick={() => handleRemoveImage(attachment.id)}>Delete</Button>
              </Stack>
            </Stack>
          )
        })}
      </Box>

      {
        showImageModal && 
          <Dialog fullWidth onClose={toggleImageModal} open={showImageModal} maxWidth={"lg"} classes={{ paper: classes.dialog }} >
            <DialogContent sx={{p: 0.5}}>
              
              {photos.map((file) => {
                  if (activeIndex === file.id) {
                    return (
                      <Box key={file.id} width={"100%"} height={600}>
                        <img src={URL.createObjectURL(file.attachment)} style={{width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px"}} />
                      </Box>
                    );
                  }
                  return null;
                })}

            </DialogContent>

            <DialogActions sx={{p: 0}}>
              <IconButton sx={{position: "absolute", top: "0px", right: "0px", transform: "translate(50%, -50%)", backgroundColor: "black", "&:hover": {backgroundColor: "black", color: "white"}  }} size="small">
                <CloseIcon onClick={toggleImageModal} sx={{color: "white"}} />
              </IconButton>
            </DialogActions>

          </Dialog>
      }
    </Box>
  );
}
