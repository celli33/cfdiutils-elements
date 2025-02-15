import { AbstractElement } from '../common/abstract_element';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { DoctoRelacionado } from './docto_relacionado';
import { ImpuestosP } from './impuestos_p';

export class Pago extends AbstractElement {
    constructor(attributes: Record<string, unknown> = {}, children: CNodeInterface[] = []) {
        super('pago20:Pago', attributes, children);
    }

    public getChildrenOrder(): string[] {
        return ['pago20:DoctoRelacionado', 'pago20:ImpuestosP'];
    }

    public addDoctoRelacionado(attributes: Record<string, unknown> = {}): DoctoRelacionado {
        const subject = new DoctoRelacionado(attributes);
        this.addChild(subject);
        return subject;
    }

    public multiDoctoRelacionado(...elementAttributes: Record<string, unknown>[]): Pago {
        elementAttributes.forEach((attributes) => {
            this.addDoctoRelacionado(attributes);
        });
        return this;
    }

    public getImpuestosP(): ImpuestosP {
        return this.helperGetOrAdd(new ImpuestosP());
    }

    public addImpuestosP(attributes: Record<string, unknown> = {}): ImpuestosP {
        const subject = this.getImpuestosP();
        subject.addAttributes(attributes);
        return subject;
    }
}
