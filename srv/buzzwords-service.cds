using { com.anditru.buzzwords as db } from '../db/schema';

service BuzzwordsService {
    entity AiBuzzwords as projection on db.AiBuzzwords;
}
