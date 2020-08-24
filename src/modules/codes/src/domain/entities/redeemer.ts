import type { Email } from '../value-objects/email';
import { Entity } from '~root/lib/domain/entity';

interface Props {
  email: Email;
}

export class Redeemer extends Entity<Props> {
  get email() {
    return this.props.email;
  }
}
