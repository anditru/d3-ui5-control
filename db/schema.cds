using { cuid } from '@sap/cds/common';

namespace com.anditru.buzzwords;

entity AiBuzzwords : cuid {
    text    : String;
    weight  : Integer;
};
