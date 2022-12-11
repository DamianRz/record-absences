import React from 'react'
import MDToolbar from '@mui/material/Toolbar'
import styles from './toolbar.module.scss'
import PersonIcon from '@mui/icons-material/Person'
import NotificationsIcon from '@mui/icons-material/Notifications'

interface DrawerProps {
  isAdmin: boolean
}

const username = 'Damian Rodriguez'
const instituteName = 'ITS - Montevideo'

const Toolbar: React.FC<DrawerProps> = ({ isAdmin }) => {
  return (
        <MDToolbar className={styles.toolbar}>
            <div className={styles.left}>
                <p className={styles.title}>{instituteName}</p>
            </div>
            <div className={styles.right}>
                {/* notificaciones podria ser un component  */}
                <NotificationsIcon />

                {/* podria desplegar un menu del usuario */}
                <div className={styles.accout}>
                    <PersonIcon />
                    {/* <p>{username}</p> */}
                </div>
                {/* <ExitToAppIcon className={styles.exit} /> */}
            </div>
        </ MDToolbar>
  )
}

export default Toolbar
