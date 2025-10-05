import { useState, useCallback } from 'react'
import { Button, Card, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { TeamMemberForm } from './TeamMemberForm'
import { TeamMemberCard } from './TeamMemberCard'
import type { TeamMember } from '../types'

interface TeamListProps {
  teamMembers: TeamMember[]
  onTeamMembersChange: (members: TeamMember[]) => void
}

export function TeamList({ teamMembers, onTeamMembersChange }: TeamListProps) {
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberContact, setNewMemberContact] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberType, setNewMemberType] = useState<'employee' | 'freelancer'>('employee')
  const [newMemberCharges, setNewMemberCharges] = useState<number>(0)
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editMemberName, setEditMemberName] = useState('')
  const [editMemberContact, setEditMemberContact] = useState('')
  const [editMemberEmail, setEditMemberEmail] = useState('')
  const [editMemberType, setEditMemberType] = useState<'employee' | 'freelancer'>('employee')
  const [editMemberCharges, setEditMemberCharges] = useState<number>(0)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleAddMember = useCallback(() => {
    setShowAddMember(true)
  }, [])

  const handleCancelAddMember = useCallback(() => {
    setShowAddMember(false)
    setNewMemberName('')
    setNewMemberContact('')
    setNewMemberEmail('')
    setNewMemberType('employee')
    setNewMemberCharges(0)
  }, [])

  const handleSaveMember = useCallback(() => {
    if (newMemberName && newMemberContact && newMemberType && (newMemberType === 'employee' || (newMemberType === 'freelancer' && newMemberCharges > 0))) {
      const newMember: TeamMember = {
        name: newMemberName,
        avatar: getInitials(newMemberName),
        contactNumber: newMemberContact,
        email: newMemberEmail,
        type: newMemberType,
        charges: newMemberType === 'freelancer' ? newMemberCharges : undefined
      }
      
      onTeamMembersChange([...teamMembers, newMember])
      handleCancelAddMember()
    }
  }, [newMemberName, newMemberContact, newMemberEmail, newMemberType, newMemberCharges, teamMembers, onTeamMembersChange, handleCancelAddMember])

  const handleEditMember = useCallback((index: number) => {
    const member = teamMembers[index]
    setEditingIndex(index)
    setEditMemberName(member.name)
    setEditMemberContact(member.contactNumber || '')
    setEditMemberEmail(member.email || '')
    setEditMemberType(member.type)
    setEditMemberCharges(member.charges || 0)
  }, [teamMembers])

  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null)
    setEditMemberName('')
    setEditMemberContact('')
    setEditMemberEmail('')
    setEditMemberType('employee')
    setEditMemberCharges(0)
  }, [])

  const handleUpdateMember = useCallback(() => {
    if (editMemberName && editMemberContact && editMemberType && (editMemberType === 'employee' || (editMemberType === 'freelancer' && editMemberCharges > 0)) && editingIndex !== null) {
      const updatedMember: TeamMember = {
        name: editMemberName,
        avatar: getInitials(editMemberName),
        contactNumber: editMemberContact,
        email: editMemberEmail,
        type: editMemberType,
        charges: editMemberType === 'freelancer' ? editMemberCharges : undefined
      }
      
      const updatedMembers = [...teamMembers]
      updatedMembers[editingIndex] = updatedMember
      onTeamMembersChange(updatedMembers)
      handleCancelEdit()
    }
  }, [editMemberName, editMemberContact, editMemberEmail, editMemberType, editMemberCharges, editingIndex, teamMembers, onTeamMembersChange, handleCancelEdit])

  const handleDeleteMember = useCallback((index: number) => {
    const updatedMembers = teamMembers.filter((_, i) => i !== index)
    onTeamMembersChange(updatedMembers)
  }, [teamMembers, onTeamMembersChange])

  return (
    <Card 
      title="Team Allocation" 
      extra={
        <Button 
          type="text" 
          icon={<PlusOutlined />}
          onClick={handleAddMember}
        >
          Add Team Member
        </Button>
      }
      className="w-full"
    >
      <Space direction="vertical" size="middle" className="w-full">
        {/* Add Member Form */}
        {showAddMember && (
          <TeamMemberForm
            memberName={newMemberName}
            contactNumber={newMemberContact}
            email={newMemberEmail}
            memberType={newMemberType}
            charges={newMemberCharges}
            onNameChange={setNewMemberName}
            onContactChange={setNewMemberContact}
            onEmailChange={setNewMemberEmail}
            onTypeChange={setNewMemberType}
            onChargesChange={(value) => setNewMemberCharges(value || 0)}
            onSave={handleSaveMember}
            onCancel={handleCancelAddMember}
            saveButtonText="Save"
          />
        )}

        {/* Team Member List */}
        {teamMembers?.map((member, index) => (
          <div key={index}>
            {editingIndex === index ? (
              <TeamMemberForm
                memberName={editMemberName}
                contactNumber={editMemberContact}
                email={editMemberEmail}
                memberType={editMemberType}
                charges={editMemberCharges}
                onNameChange={setEditMemberName}
                onContactChange={setEditMemberContact}
                onEmailChange={setEditMemberEmail}
                onTypeChange={setEditMemberType}
                onChargesChange={(value) => setEditMemberCharges(value || 0)}
                onSave={handleUpdateMember}
                onCancel={handleCancelEdit}
                saveButtonText="Update"
              />
            ) : (
              <TeamMemberCard
                member={member}
                onEdit={() => handleEditMember(index)}
                onDelete={() => handleDeleteMember(index)}
              />
            )}
          </div>
        ))}
      </Space>
    </Card>
  )
}
