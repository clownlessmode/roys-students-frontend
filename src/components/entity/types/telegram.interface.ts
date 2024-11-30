import { DefaultEntity } from "./default.entity";

export interface Telegram extends DefaultEntity {
  telegram_id: number;
  username: string;
  first_name?: string;
  language_code: string;
  is_bot: boolean;
}
