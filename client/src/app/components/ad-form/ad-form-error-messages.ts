export class ErrorMessage {
  constructor(
    public forControl: string,
    public forValidator: string,
    public text: string
  ) {  }
}

export const AdFormErrorMessages = [
  new ErrorMessage('title', 'required', 'Es muss ein Titel vergeben werden'),
  new ErrorMessage('date', 'required', 'Es muss ein Datum ausgewählt werden')
];
