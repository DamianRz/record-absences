import React, { FC } from 'react'
import MIButton from '@mui/material/Button'
import styles from './button.module.scss'

interface buttonProps {
  label: string
  type: 'error' | 'accept' | 'cancel'
  className?: string
}

// const Button: FC<buttonProps> = ({ label, type, className }) => {
//     return <MIButton
//         type={type}
//         className={`button ${className}`}
//         variant="contained"
//         >
//             { label }
//         </MIButton>
// };

const Button = () => {}

export default Button
