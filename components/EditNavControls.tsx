"use client";
// components/EditNavControls.tsx
import React, { FC } from 'react'
import { Box, Button } from '@mui/material'

interface EditNavControlsProps {
  onSave: () => void
  onDiscard: () => void
}

const EditNavControls: FC<EditNavControlsProps> = ({ onSave, onDiscard }) => {
  return (
    <Box display="flex" justifyContent="flex-end" my={2}>
      <Button variant="contained" color="primary" onClick={onSave} sx={{ mr: 1 }}>
        Save
      </Button>
      <Button variant="outlined" color="secondary" onClick={onDiscard}>
        Discard
      </Button>
    </Box>
  )
}

export default EditNavControls
