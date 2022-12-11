import { Button, Dialog } from '@mui/material'
import React from 'react'

interface AlertDialogProps {
  title: string
  acceptLabel: string
  backLabel: string
  info: string
  open: boolean
  onClose: any
  onAccept: any
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  title,
  open,
  info,
  onClose,
  onAccept,
  acceptLabel,
  backLabel
}) => {
  const handleClose: any = () => {
    onClose()
  }

  const handleAccept: any = () => {
    onAccept()
  }

  return (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="grid p-4 text-center bg-white">
          <span className="mb-4 text-sm">{title}</span>
          <span className="text-sm">{info}</span>
        </div>
        <div className='flex p-4 space-x-4'>
            <Button
                onClick={handleAccept}
                className='normal-case'
                variant='outlined'
                color='error'
            >
                {acceptLabel}
            </Button>
            <Button
                onClick={handleClose}
                className='normal-case'
                variant='outlined'
                color='primary'
            >
                {backLabel}
            </Button>
        </div>
        </Dialog>
  )
}

export default AlertDialog
