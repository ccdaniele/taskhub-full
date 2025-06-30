class Friendship < ApplicationRecord
  belongs_to :requester, class_name: 'User'
  belongs_to :requestee, class_name: 'User'
  
  validates :requester_id, uniqueness: { scope: :requestee_id }
  validates :status, inclusion: { in: %w[pending accepted declined] }
  validate :cannot_friend_self
  
  scope :pending, -> { where(status: 'pending') }
  scope :accepted, -> { where(status: 'accepted') }
  scope :declined, -> { where(status: 'declined') }
  
  private
  
  def cannot_friend_self
    errors.add(:requestee, "can't send friend request to yourself") if requester_id == requestee_id
  end
end 
