import React, {useState} from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import makeStyles from "@mui/styles/makeStyles";
import { styled } from '@mui/material/styles';
import { DialogActions, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import FeedbackEditor from "./FeedbackEditor";
import SubmittedPage from "./Success";
import axios from "axios";
import Error from "./Error";

export interface FeedbackChatDialogProps {
  open: boolean;
  onClose: () => void;
  setIsSubmitted: (value: boolean) => void;
  setError: (value: string) => void;
}

const useStyles = makeStyles({
  dialog: {
    position: "absolute",
    right: 5,
    bottom: 50,
    "&": {
      position: "absolute !important",
      maxHeight: "70vh !important",
    },
  },
});

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type FeedbackState = {
  content: string;
  attachments: { id: number; attachment: File; type: "photo" | "video" | "file" }[];
};

function FeedbackChatDialog(props: FeedbackChatDialogProps) {
  const [feedback, setFeedback] = useState<FeedbackState>({ content: "", attachments: [] });
  const [loading, setLoading] = useState(false)

  const { onClose, open, setIsSubmitted, setError } = props;
  const classes = useStyles();

  const getFileType = (file: File): "photo" | "video" | "file" => {
    if (file.type.startsWith("image/")) return "photo";
    if (file.type.startsWith("video/")) return "video";
    return "file";
  };

  const handleClose = () =>  onClose();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    setFeedback((prev) => {
      const currentAttachments = prev.attachments;
      const startId = currentAttachments.length > 0 ? currentAttachments[currentAttachments.length - 1].id + 1 : 0;
  
      const newFiles = Array.from(e.target.files || []).map((file, index) => ({
        id: startId + index,
        attachment: file, 
        type: getFileType(file),
      }));
  
      return {
        ...prev,
        attachments: [...currentAttachments, ...newFiles],
      };
    });
  
    e.target.value = "";
  };

  const handleFormSubmit = async () => {
    if(feedback.content.trim()) {
      setLoading(true)

      const formData = new FormData();
      formData.append("content", feedback.content);
      if(feedback.attachments.length > 0){
        feedback.attachments.forEach((attachment, index) => {
          formData.append(`images[${index}]`, attachment.attachment);
        });
      }
      
      try {
        await axios({method: "post", url: "", data: formData, headers: { "Content-Type": "multipart/form-data" }})
          .then((response) => {
            console.log(response);
            setError("")
          })
          .catch((err) => {
            console.error(err.message);
            setError(err.message)
          });
      } catch(err) {
        setError("Error !!")
        console.error(err);
      }
  
      setLoading(false)
      setIsSubmitted(true);
    }
  }
 
  return (
    <Dialog onClose={handleClose} open={open} maxWidth={"sm"} fullWidth classes={{ paper: classes.dialog }} >
      <DialogTitle>
        <Typography gutterBottom variant="h5" component="div" fontWeight={800}>
          Here to help
        </Typography>
        <Typography variant="body1" gutterBottom>
          We can help you clarify any doubts or you can share any feedback here.
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          Please make sure to add the screenshots or screen recordings of the
          issue, this will help us understand better Describe the issue in
          details Post Feedback
        </Typography>
      </DialogTitle>

      <DialogContent>
        <FeedbackEditor feedback={feedback} setFeedback={setFeedback} />
      </DialogContent>

      <DialogActions>
        <Stack direction={"row"} justifyContent={'space-between'} alignItems={'center'} gap={4} width={"100%"} px={2} pb={1}>
          <Button loading={loading} loadingPosition="start" variant="contained" sx={{borderRadius: "10px", height: "fit-content", backgroundColor: feedback.content ? "rgba(96, 36, 216, 1)" : "rgba(212, 212, 212, 1)"}} onClick={handleFormSubmit} >Post Feedback</Button>
          
          <Stack direction={"row"} alignItems={'center'} gap={2} py={1}>
            <IconButton component="label" role={undefined} tabIndex={-1} sx={{p: 0}}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="24" fill="#DCEEFF" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4286 29.2038C15.9358 29.2038 16.347 29.615 16.347 30.1222V32.5711C16.347 32.7402 16.484 32.8773 16.6531 32.8773H31.347C31.5161 32.8773 31.6531 32.7402 31.6531 32.5711V30.1222C31.6531 29.615 32.0643 29.2038 32.5715 29.2038C33.0787 29.2038 33.4898 29.615 33.4898 30.1222V32.5711C33.4898 33.7546 32.5305 34.714 31.347 34.714H16.6531C15.4696 34.714 14.5103 33.7546 14.5103 32.5711V30.1222C14.5103 29.615 14.9214 29.2038 15.4286 29.2038Z" fill="#0075FF"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22.4546 29.0535C21.8247 29.0535 21.2993 28.5721 21.2443 27.9447C21.0562 25.7985 21.023 23.6418 21.1449 21.4912C20.8425 21.4745 20.5402 21.4552 20.238 21.4331L18.4141 21.3002C17.7108 21.2489 17.3177 20.4648 17.6974 19.8706C18.9978 17.8354 20.6735 16.0661 22.6351 14.6571L23.3658 14.1322C23.7448 13.8599 24.2553 13.8599 24.6342 14.1322L25.365 14.6571C27.3266 16.0661 29.0022 17.8354 30.3027 19.8706C30.6824 20.4648 30.2892 21.2489 29.586 21.3002L27.7621 21.4331C27.4599 21.4552 27.1576 21.4745 26.8552 21.4912C26.9771 23.6418 26.9439 25.7985 26.7558 27.9447C26.7008 28.5721 26.1754 29.0535 25.5455 29.0535H22.4546Z" fill="#0075FF" />
              </svg>
              <VisuallyHiddenInput type="file" onChange={handleImageSelect} multiple />
            </IconButton>

            <IconButton sx={{p: 0}} onClick={handleClose}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="24" fill="#EEEEEE" />
                <path d="M28.9799 20.3199C29.3386 19.9612 29.3386 19.3797 28.9799 19.021C28.6212 18.6623 28.0397 18.6623 27.681 19.021L24.0009 22.7011L20.3208 19.021C19.9621 18.6623 19.3806 18.6623 19.0219 19.021C18.6633 19.3797 18.6633 19.9612 19.0219 20.3199L22.7021 24L19.0219 27.6801C18.6633 28.0388 18.6633 28.6203 19.0219 28.979C19.3806 29.3377 19.9621 29.3377 20.3208 28.979L24.0009 25.2989L27.6811 28.979C28.0397 29.3377 28.6213 29.3377 28.9799 28.979C29.3386 28.6203 29.3386 28.0388 28.9799 27.6801L25.2998 24L28.9799 20.3199Z" fill="black" />
              </svg>
            </IconButton>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default function FeedbackChatbox() {
  const [open, setOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg" >
          <rect width="75" height="75" rx="37.5" fill="#BC99FF" />
          <path d="M37.5748 22.1938C48.634 22.1938 56.1687 33.3996 51.9961 43.6414L50.2123 48.0198C50.0527 48.4116 50.1694 48.8617 50.4992 49.1266L54.2712 52.1559C54.5877 52.4101 54.7094 52.8363 54.5746 53.2193C54.4399 53.6022 54.0782 53.8584 53.6722 53.8584H38.7099C29.4828 53.8584 22.0026 46.3783 22.0026 37.1511C22.0026 28.8904 28.6992 22.1938 36.9599 22.1938H37.5748Z" fill="white" />
        </svg>
      </IconButton>
      
      {
        isSubmitted ? 
          (error ? <Error open={open} onClose={handleClose} setIsSubmitted={setIsSubmitted} /> 
            : <SubmittedPage open={open} onClose={handleClose} setIsSubmitted={setIsSubmitted}  />
          ) 
          : <FeedbackChatDialog open={open} onClose={handleClose} setIsSubmitted={setIsSubmitted} setError={setError} />
      }
      
    </div>
  );
}
