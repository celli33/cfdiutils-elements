import { AbstractElement } from '../common/abstract_element';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { TrasladoDR } from './traslado_d_r';

export class TrasladosDR extends AbstractElement {
    constructor(attributes: Record<string, unknown> = {}, children: CNodeInterface[] = []) {
        super('pago20:TrasladosDR', attributes, children);
    }

    public addTrasladoDR(attributes: Record<string, unknown> = {}): TrasladoDR {
        const subject = new TrasladoDR(attributes);
        this.addChild(subject);
        return subject;
    }

    public multiTrasladoDR(...elementAttributes: Record<string, unknown>[]): TrasladosDR {
        elementAttributes.forEach((attributes) => {
            this.addTrasladoDR(attributes);
        });
        return this;
    }
}
