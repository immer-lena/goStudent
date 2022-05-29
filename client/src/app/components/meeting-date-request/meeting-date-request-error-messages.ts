export class ErrorMessage {
  constructor(
    public forControl: string,
    public forValidator: string,
    public text: string
  ) {  }
}

export const MeetingDateRequestErrorMessages = [
  new ErrorMessage('date', 'required', 'Es muss ein Datum ausgewählt werden')
];
