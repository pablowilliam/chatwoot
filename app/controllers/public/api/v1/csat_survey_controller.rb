class Public::Api::V1::CsatSurveyController < PublicController
  before_action :set_conversation
  before_action :set_message
  before_action :set_inbox # Añade este nuevo método para establecer @inbox

  def show; end

  def update
    render json: { error: 'You cannot update the CSAT survey after the lock period' }, status: :unprocessable_entity and return if check_csat_locked

    @message.update!(message_update_params[:message])
  end

  private

  def set_conversation
    return if params[:id].blank?

    @conversation = Conversation.find_by!(uuid: params[:id])
  end

  def set_message
    @message = @conversation.messages.find_by!(content_type: 'input_csat')
  end

  def set_inbox
    @inbox = @conversation.inbox # Asume que la conversación está vinculada a un inbox
  end

  def message_update_params
    params.permit(message: [{ submitted_values: [:name, :title, :value, { csat_survey_response: [:feedback_message, :rating] }] }])
  end

  def check_csat_locked
    lock_period = @inbox.csat_lock_period_days || 14
    (Time.zone.now.to_date - @message.created_at.to_date).to_i > lock_period
  end
end
