import { Box, Stack, TextField, Dialog, DialogContent, Button, IconButton, DialogActions } from "@mui/material";
import { useState, useEffect } from "react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from "@mui/styles";

interface FeedbackEditorProps {
  feedback: { content: string; files: File[] };
  setFeedback: (newFeedback: { content: string; files: File[] }) => void;
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


  const toggleImageModal = () => {
    setShowImageModal(!showImageModal);
  }

  const openImageModal = (index: number) => {
    setActiveIndex(index)
    setShowImageModal(true);
  }

  const handleRemoveImage = (index: number) => {
    const newList = feedback.files.filter((_, i) => index !== i);
    setFeedback({...feedback, files: newList});
  }
  
  const handleFeedbackContentChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setFeedback({...feedback,content: e.target.value})
  const prevSlide = () => setActiveIndex((prevIndex) => prevIndex === 0 ? (feedback.files.length - 1) : prevIndex - 1);
  const nextSlide = () => setActiveIndex((prevIndex) => prevIndex === (feedback.files.length - 1) ? 0 : prevIndex + 1);

  useEffect(() => {
    if (!feedback.files || feedback.files.length === 0) {
      console.log("Files not available yet.");
      return;
    }

    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "ArrowLeft") prevSlide();
      if (event.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [[feedback.files]]);


  return (
    <div className="p-4 max-w-lg mx-auto">
      <TextField value={feedback.content} onChange={handleFeedbackContentChange} id="filled-multiline-static" multiline rows={4} label="Describe the issue in details" variant="filled" fullWidth />
      
      <Box pt={2}>
      {feedback.files.map((_, index) => {
          return (<Stack gap={1} key={index} direction={'row'} pt={1} justifyContent={'flex-end'} alignItems={'center'}>
              <Button size="small" sx={{backgroundColor: "rgba(222, 210, 238, 1)", color: "black", borderRadius: "20px"}} variant="contained" startIcon={<PlayArrowIcon sx={{color: "rgba(96, 36, 216, 1)", mr: 1}} />} onClick={()=>openImageModal(index)}>Preview</Button>
              <Button size="small" sx={{backgroundColor: "rgba(255, 227, 227, 1)", color: "rgb(224, 36, 36)", borderRadius: "20px"}} variant="contained" startIcon={<DeleteIcon />} onClick={() => handleRemoveImage(index)}>Delete</Button>
            </Stack>)
        })}
      </Box>

      {
        showImageModal && 
          <Dialog fullWidth onClose={toggleImageModal} open={showImageModal} maxWidth={"lg"} classes={{ paper: classes.dialog }} >
            <DialogContent sx={{p: 0.5}}>
              
              {feedback.files.map((file, index) => {
                  if (activeIndex === index) {
                    return (
                      <Box key={index} width={"100%"} height={600}>
                        <img src={URL.createObjectURL(file)} style={{width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px"}} />
                      </Box>
                    );
                  }
                  return null;
                })}

            </DialogContent>

            <DialogActions sx={{p: 0}}>
              <IconButton sx={{position: "absolute", top: "0px", right: "0px", transform: "translate(50%, -50%)", backgroundColor: "black"}} size="small">
                <CloseIcon onClick={toggleImageModal} sx={{color: "white"}} />
              </IconButton>
            </DialogActions>

          </Dialog>
      }
    </div>
  );
}
