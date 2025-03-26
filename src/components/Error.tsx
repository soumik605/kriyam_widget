import { Dialog, DialogContent, Stack, Typography, DialogActions, Button } from '@mui/material'

interface SubmitPageProps {
  open: boolean;
  onClose: () => void;
  setIsSubmitted: (value: boolean) => void
}

const Error = (props: SubmitPageProps) => {
  const { open, onClose, setIsSubmitted } = props

  const handleClose = () => {
    onClose()
    setIsSubmitted(false)
  }

  return (
    <Dialog open={open} maxWidth={"sm"} fullWidth onClose={handleClose}>
      <DialogContent sx={{pt: 4}}>
          <Typography textAlign={'center'} variant='h6'>Sorry, we could not post this feedback. There seems to be an error in the server. Please try again in sometime</Typography>
      </DialogContent>
      <DialogActions sx={{p: 0}}>
        <Stack direction={'row'} justifyContent={'flex-end'} p={3} width={"100%"}>
          <Button variant='outlined' sx={{border: "1px solid rgba(171, 169, 197, 1)", color: "black", borderRadius: 2}} onClick={handleClose}>Close</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default Error