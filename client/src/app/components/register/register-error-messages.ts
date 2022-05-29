export class ErrorMessage {
  constructor(
    public forControl: string,
    public forValidator: string,
    public text: string
  ) {  }
}

export const RegisterErrorMessages = [
  new ErrorMessage('email', 'required', 'Es muss eine Email-Adresse angegeben werden'),
  new ErrorMessage('username', 'required', 'Es muss eine Email-Adresse angegeben werden'),
  new ErrorMessage('password', 'required', 'Es muss eine Email-Adresse angegeben werden'),
  new ErrorMessage('tutor', 'required', 'Es muss eine Email-Adresse angegeben werden'),
  new ErrorMessage('study', 'required', 'Es muss eine Email-Adresse angegeben werden')
];
