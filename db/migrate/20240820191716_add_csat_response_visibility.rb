class AddCsatResponseVisibility < ActiveRecord::Migration[7.0]
  def change
    return if column_exists?(:inboxes, :csat_response_visible)

    add_column :inboxes, :csat_response_visible, :boolean, default: false, null: false
  end
end
