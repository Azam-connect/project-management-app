import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

export default function UploadModal2({
  ModalContent,
  open,
  setOpen,
  setIsEdit,
  ...modalContentProps
}) {
  const handleClose = () => {
    setOpen(false);
    if (setIsEdit) setIsEdit(false);
  };
  const ContentComponent = ModalContent;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {
              xs: '90%', // for small screens
              sm: 500, // for tablets
              md: 800, // for desktops
            },
            bgcolor: 'background.paper',
            border: 'none',
            borderRadius: 2,
            boxShadow: 24,
            p: { xs: 1, sm: 1, md: 2 },
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <ContentComponent onClose={handleClose} {...modalContentProps} />
        </Box>
      </Fade>
    </Modal>
  );
}
