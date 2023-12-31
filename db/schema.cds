using { cuid } from '@sap/cds/common';

namespace com.at.buzzwords;

entity AiBuzzwords : cuid {
    text    : String;
    weight  : Integer;
};
