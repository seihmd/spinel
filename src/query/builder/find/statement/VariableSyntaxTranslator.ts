import camelCase from 'lodash.camelcase';
import { NodeEntityMetadata } from '../../../../metadata/schema/entity/NodeEntityMetadata';
import { RelationshipEntityMetadata } from '../../../../metadata/schema/entity/RelationshipEntityMetadata';
import {
  AnyNodeElement,
  AnyRelationshipElement,
} from '../../../element/Element';
import { NodeElement } from '../../../element/NodeElement';
import { RelationshipElement } from '../../../element/RelationshipElement';
import { BranchMaterialInterface } from '../../../meterial/branch/BranchMaterialInterface';
import { NodeBranchMaterial } from '../../../meterial/branch/NodeBranchMaterial';
import { Path } from '../../../path/Path';
import { parseVariableSyntax } from './parseVariableSyntax';

type VariableMap = Map<
  string,
  [string, NodeEntityMetadata | RelationshipEntityMetadata | null]
>;

export class VariableSyntaxTranslator {
  static withPath(
    path: Path,
    branchMaterial: BranchMaterialInterface | null = null
  ): VariableSyntaxTranslator {
    const map: VariableMap = new Map();
    const rootKey = path.getRoot().getGraphParameterKey();

    if (rootKey !== null) {
      map.set(rootKey, [
        path.getRoot().getVariableName(),
        findEntityMetadata(path.getRoot()),
      ]);
    }

    const elements = path
      .getSteps()
      .map((step) => [step.getRelationship(), step.getNode()])
      .flat();

    elements.forEach((element, index) => {
      const graphKey = element.getWhereVariableName();
      if (graphKey === null) {
        return;
      }

      if (index === elements.length - 1 && branchMaterial) {
        if (branchMaterial instanceof NodeBranchMaterial) {
          map.set('@', [
            element.getVariableName(),
            findEntityMetadata(element),
          ]);
        } else {
          map.set('@.' + graphKey, [
            element.getVariableName(),
            findEntityMetadata(element),
          ]);
        }
      } else {
        map.set(graphKey, [
          element.getVariableName(),
          findEntityMetadata(element),
        ]);
      }
    });

    return new VariableSyntaxTranslator(map);
  }

  static withNodeElement(nodeElement: NodeElement): VariableSyntaxTranslator {
    const map: VariableMap = new Map();
    map.set(camelCase(nodeElement.getCstr().name), [
      nodeElement.getVariableName(),
      findEntityMetadata(nodeElement),
    ]);

    return new VariableSyntaxTranslator(map);
  }

  constructor(private readonly map: VariableMap) {}

  translate(syntax: string): string | null {
    const parsed = parseVariableSyntax(syntax) ?? [];
    for (const [variable, property] of parsed) {
      let [translated, metadata] = this.map.get(variable) ?? [];
      if (translated === undefined) {
        continue;
      }

      if (property !== null) {
        if (metadata) {
          if (property.includes('.')) {
            const splitted = property.split('.');
            if (splitted.length !== 2) {
              throw new Error(property);
            }

            translated += `.${
              metadata.toEmbeddedNeo4jKey(splitted[0], splitted[1]) ?? ''
            }`;
          } else {
            translated += `.${metadata.toNeo4jKey(property)}`;
          }
        } else {
          translated += `.${property}`;
        }
      }

      return translated;
    }

    return null;
  }
}

function findEntityMetadata(
  element: AnyNodeElement | AnyRelationshipElement
): NodeEntityMetadata | RelationshipEntityMetadata | null {
  if (element instanceof NodeElement) {
    return element.getEntityMetadata();
  }
  if (element instanceof RelationshipElement) {
    return element.getEntityMetadata();
  }

  return null;
}
