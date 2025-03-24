class RemoveAgentConversationViewedFlag < ActiveRecord::Migration[7.0]
  def up
    index = Account.new.all_features.keys.index('agent_conversation_viewed')
    return unless index # Si no existe, no hacemos nada

    execute("UPDATE accounts SET feature_flags = feature_flags & ~(1 << #{index});")
  end

  def down
    # No es necesario revertir, pero si quieres puedes hacer algo aquí
  end
end
