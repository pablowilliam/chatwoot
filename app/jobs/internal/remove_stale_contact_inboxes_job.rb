# housekeeping
# remove contact inboxes that does not have any conversations
# and are older than 3 months

class Internal::RemoveStaleContactInboxesJob < ApplicationJob
  queue_as :low

  def perform(account)
    removed_count = Internal::RemoveStaleContactInboxesService.new(account_id: account.id).perform
    Rails.logger.info "Successfully cleaned up contact inboxes for account #{account.id} (removed #{removed_count} inboxes)"
  end
end
