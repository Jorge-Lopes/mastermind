export const getStartGameOfferSpecs = (instance: unknown) => {
  const offerId = `start_game_${Date.now()}`;

  const invitationSpec = {
    source: 'contract',
    instance,
    publicInvitationMaker: 'makeGameInvitation',
  };

  const onStatusChange = (update: { status: any; data: any }) => {
    console.log('UPDATE', update);
    const { status, data } = update;

    if (status === 'error') {
      alert(`Offer error: ${data}`);
    } else if (status === 'seated') {
      alert('Offer accepted');
    }
  };

  return {
    offerId,
    invitationSpec,
    onStatusChange,
  };
};

export const getMakeGuessOfferSpecs = (gameIndex: string | null) => {
  if (!gameIndex) return null;

  const previousOffer = gameIndex;
  console.log('LOG: previousOffer', previousOffer);

  const invitationSpec = {
    source: 'continuing',
    previousOffer,
    invitationMakerName: 'makeGuessInvitation',
  };

  const onStatusChange = (update: { status: any; data: any }) => {
    console.log('UPDATE', update);
    const { status, data } = update;

    if (status === 'error') {
      alert(`Offer error: ${data}`);
    } else if (status === 'seated') {
      alert('Offer accepted');
    }
  };

  return {
    invitationSpec,
    onStatusChange,
  };
};

export const formatFeedbackList = (feedbackList: any[]) => {
  const formattedFeedbackList = new Array();

  feedbackList.forEach((feedback) => {
    formattedFeedbackList.push([
      feedback.correctPositionCount,
      feedback.correctValueCount,
    ]);
  });

  return formattedFeedbackList;
};
