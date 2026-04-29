'use client'

import { useState } from 'react'
import { BIS_ROLES, type UserRole } from '@/lib/data'
import { useToast } from '@/components/ui/Toast'

const OFFICES = [
  'Office of the Senate President',
  'Committee on Finance',
  'Committee on Ways & Means',
  'Senate Secretariat',
  'Senate Electoral Tribunal',
  'Commission on Appointments',
]

export default function InviteModal({ onClose }: { onClose: () => void }) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('clerk')
  const toast = useToast()

  return (
    <>
      <div className="modal-scrim show" onClick={onClose} />
      <div className="modal show">
        <div className="modal-head">
          <div>
            <h3>Invite a new user</h3>
            <p>They&apos;ll receive an email with sign-in instructions and MFA setup.</p>
          </div>
          <button className="close" onClick={onClose}><i className="pi pi-times" /></button>
        </div>

        <div className="modal-body">
          <div className="grid-2">
            <div className="field">
              <label>First Name</label>
              <div className="input-wrap"><input placeholder="e.g. Maria" /></div>
            </div>
            <div className="field">
              <label>Last Name</label>
              <div className="input-wrap"><input placeholder="e.g. Santos" /></div>
            </div>
          </div>

          <div className="field">
            <label>Senate Email</label>
            <div className="input-wrap">
              <i className="pi pi-envelope" />
              <input type="email" placeholder="first.last@senate.gov.ph" />
            </div>
            <div className="field-hint">Must end in <code>@senate.gov.ph</code>.</div>
          </div>

          <div className="field">
            <label>Office</label>
            <div className="input-wrap">
              <i className="pi pi-building" />
              <select>
                {OFFICES.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Role</label>
            <div className="role-cards">
              {(Object.entries(BIS_ROLES) as [UserRole, typeof BIS_ROLES[UserRole]][]).map(([k, r]) => (
                <div
                  key={k}
                  className={`role-card${selectedRole === k ? ' on' : ''}`}
                  onClick={() => setSelectedRole(k)}
                >
                  <i className={`pi ${r.icon}`} />
                  <div>
                    <div className="rc-name">{r.name}</div>
                    <div className="rc-desc">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <label className="check">
            <input type="checkbox" defaultChecked />
            <span>Require MFA enrollment on first sign-in</span>
          </label>
          <label className="check">
            <input type="checkbox" />
            <span>Notify the office head (co-signatory) for approval</span>
          </label>
        </div>

        <div className="modal-foot">
          <button className="btn secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn primary"
            onClick={() => { onClose(); toast('Invitation sent.', 'pi-send') }}
          >
            <i className="pi pi-send" /> Send Invitation
          </button>
        </div>
      </div>
    </>
  )
}
