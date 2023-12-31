using { com.at.buzzwords as db } from '../db/schema';

@requires: 'authenticated-user'
service BuzzwordsService {
    entity AiBuzzwords as projection on db.AiBuzzwords;
}
