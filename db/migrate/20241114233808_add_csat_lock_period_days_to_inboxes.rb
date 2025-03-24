class AddCsatLockPeriodDaysToInboxes < ActiveRecord::Migration[7.0]
  def change
    add_column :inboxes, :csat_lock_period_days, :integer, default: 14, null: false
  end
end
