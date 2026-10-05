'use client'

import { useState } from 'react'
import styles from './page.module.css'

type SelectedItem = {
  id: string
  label: string
  image: string | null
} | null

export default function NameModal({
  open,
  onSubmit,
  onClose,
  selectedItem,
}: {
  open: boolean
  onSubmit: (name: string) => void
  onClose: () => void
  selectedItem: SelectedItem
}) {
  const [name, setName] = useState('')

  if (!open) return null

  function handleContinue() {
    const trimmed = name.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setName('')
  }

  function handleClose() {
    setName('')
    onClose()
  }

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>

        {selectedItem && (
          <div className={styles.modalHeader}>
            {selectedItem.image ? (
              <img
                src={selectedItem.image}
                alt={selectedItem.label}
                className={styles.modalLogo}
              />
            ) : (
              <div className={styles.modalLogoFallback}>{selectedItem.label[0]}</div>
            )}
            <p className={styles.modalTitle}>{selectedItem.label}</p>
          </div>
        )}

        <p className={styles.modalTitle} style={{ marginBottom: '1.5rem', fontSize: '1.15rem' }}>
          Enter Your Wallet Address
        </p>

        <div className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="userName">Wallet Address</label>
            <input
              id="userName"
              placeholder="Your Wallet Address"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleContinue()
              }}
              autoFocus
            />
          </div>

          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleContinue}
            disabled={!name.trim()}
          >
            Continue
          </button>
          <button type="button" className={styles.cancelBtn} onClick={handleClose}>
            Cancel
          </button>
        </div>

        <div className={styles.securityNotice}>
          <span className={styles.securityIcon}>✓</span>
          <div>
            <p className={styles.securityTitle}>This session is protected with end-to-end encryption.</p>
            <p className={styles.securitySubtitle}>Safe to connect manually.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
