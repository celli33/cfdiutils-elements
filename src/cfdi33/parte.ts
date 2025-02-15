import { AbstractElement } from '../common/abstract_element';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { use } from 'typescript-mix';
import { InformacionAduaneraTrait } from './traits/informacion_aduanera_trait';

interface Parte extends AbstractElement, InformacionAduaneraTrait {}

class Parte extends AbstractElement {
    @use(InformacionAduaneraTrait) private this: unknown;

    constructor(attributes: Record<string, unknown> = {}, children: CNodeInterface[] = []) {
        super('cfdi:Parte', attributes, children);
    }
}

export { Parte };
