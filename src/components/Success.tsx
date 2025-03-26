import { Dialog, DialogContent, Stack, Typography, Box, DialogActions, Button } from '@mui/material'

interface SubmitPageProps {
  open: boolean;
  onClose: () => void;
  setIsSubmitted: (value: boolean) => void
}

const Success = (props: SubmitPageProps) => {
  const { open, onClose, setIsSubmitted } = props

  const handleClose = () => {
    onClose()
    setIsSubmitted(false)
  }

  return (
    <Dialog open={open} maxWidth={"sm"} fullWidth onClose={handleClose}>
      <DialogContent sx={{py: 4}}>
        <Stack alignItems={'center'}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#DED2EE"/>
            <mask id="mask0_6_4985" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="16" y="15" width="32" height="32">
            <rect x="16" y="15" width="32" height="32" fill="#6024D8"/>
            </mask>
            <g mask="url(#mask0_6_4985)">
            <path d="M28.7325 39.2552L20.8774 31.4001L23.0405 29.2371L28.7325 34.9291L40.9579 22.7037L43.1209 24.8668L28.7325 39.2552Z" fill="#6024D8"/>
            </g>
          </svg>
        </Stack>
        <Typography textAlign={'center'} mt={3} variant='h4' gutterBottom>Feedback Posted</Typography>
        <Box px={12}>
          <Typography textAlign={'center'} variant='body1'>Your feedback is successfully posted, this will help us serve you better</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{p: 0}}>
        <Stack direction={'row'} justifyContent={'flex-end'} sx={{backgroundColor: "rgba(248, 248, 255, 1)"}} p={3} width={"100%"}>
          <Button variant='outlined' sx={{border: "1px solid rgba(171, 169, 197, 1)", color: "black", borderRadius: 2}} onClick={handleClose}>Close</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default Success