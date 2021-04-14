import { readFileSync } from "fs";
import { parse, BaseJavaCstVisitorWithDefaults } from "java-parser";

// some random decomps
let intext = readFileSync("tests/EntityPlayerSP.txt", "utf8");
intext = readFileSync("tests/ChannelOutboundHandler.txt", "utf8");
// intext = readFileSync("tests/Packet.txt", "utf8");

const cst = parse(intext);

const toTSType = type => {
  switch (type) {
    case "Void":
      return "void ";
  }
};

class Visitor extends BaseJavaCstVisitorWithDefaults {
  constructor() {
    super();
    this.validateVisitor();
  }

  visit(cstNode, param) {
    // enables writing more concise visitor methods when CstNode has only a single child
    if (Array.isArray(cstNode)) {
      //visit each node in the array and return their output.
      let out = "";

      cstNode.forEach(node => {
        out += this.visit(node);
      });
      return out;
      // cstNode = cstNode[0];
    }
    // enables passing optional CstNodes concisely.
    if (cstNode == null) {
      return undefined;
    }

    if (cstNode.fullName !== undefined) {
      return this[cstNode.fullName](cstNode.children, param);
    }

    if (cstNode.tokenType) {
      // return cstNode.image + " ";
      return "";
    }

    // console.log(`${cstNode.name} ${util.inspect(cstNode.children, { depth: 1 })}`);

    return this[cstNode.name](cstNode.children, param);
  }

  visitChildren(ctx, params) {
    let out = "";
    if (params) {
      for (const token of params) {
        if (ctx[token] != null) out += this.visit(ctx[token]);
        else console.log(`token ${token} for node ${ctx} not found`);
      }
    } else {
      for (const token in ctx) {
        out += this.visit(ctx[token]);
      }
    }

    return out;
  }

  compilationUnit(ctx) {
    return this.visitChildren(ctx);
  }

  ordinaryCompilationUnit(ctx) {
    return this.visitChildren(ctx);
  }

  typeDeclaration(ctx) {
    return this.visitChildren(ctx);
  }

  classDeclaration(ctx) {
    return this.visitChildren(ctx);
  }

  classModifier(ctx) {
    let modifierStr = "";
    for (const modifier in ctx) {
      switch (ctx[modifier][0].image) {
        case "public":
          break;
        case "final":
          break;
        case "abstract":
          modifierStr += "abstract ";
          break;
      }
    }
    return `${modifierStr}${this.visitChildren(ctx)}`;
  }

  normalClassDeclaration(ctx) {
    return `class ${this.visitChildren(ctx)}`;
  }

  typeIdentifier(ctx) {
    return `${this.visitChildren(ctx)}${ctx.Identifier[0].image} `;
  }

  classBody(ctx) {
    return `{\n${this.visitChildren(ctx)}}`;
  }

  classBodyDeclaration(ctx) {
    return `${this.visitChildren(ctx)}\n`;
  }

  classMemberDeclaration(ctx) {
    return this.visitChildren(ctx);
  }

  methodDeclaration(ctx) {
    return this.visitChildren(ctx, [
      "methodModifier",
      "methodHeader",
      "methodBody",
    ]);
  }

  methodModifier(ctx) {
    let modifierStr = "";
    for (const modifier in ctx) {
      switch (ctx[modifier][0].image) {
        case "private":
          modifierStr += "private ";
          break;
        case "protected":
          modifierStr += "protected ";
          break;
        case "static":
          modifierStr += "static ";
          break;
        case "abstract":
          modifierStr += "abstract ";
          break;
      }
    }
    return `${modifierStr}${this.visitChildren(ctx)}`;
  }

  methodHeader(ctx) {
    return this.visitChildren(ctx, ["methodDeclarator", "result"]);
  }

  result(ctx) {
    let resultStr = "";
    if (ctx?.Void) return `void${this.visitChildren(ctx)}`;
    return this.visitChildren(ctx);
  }

  methodDeclarator(ctx) {
    return `${ctx.Identifier[0].image}(${this.visitChildren(ctx)}): `;
  }

  formalParameterList(ctx) {
    return this.visitChildren(ctx).replace(/(?<!:) (?=[A-z])/g, ", ");
  }

  formalParameter(ctx) {
    return this.visitChildren(ctx);
  }

  variableParaRegularParameter(ctx) {
    return this.visitChildren(ctx, ["variableDeclaratorId", "unannType"]);
  }

  unannType(ctx) {
    return this.visitChildren(ctx);
  }

  unannReferenceType(ctx) {
    return this.visitChildren(ctx);
  }

  unannClassOrInterfaceType(ctx) {
    return this.visitChildren(ctx);
  }

  unannClassType(ctx) {
    return `${
      ctx.Identifier[0].image === "String" ? "string" : ctx.Identifier[0].image
    } ${this.visitChildren(ctx)}`;
  }

  variableDeclaratorId(ctx) {
    return `${ctx.Identifier[0].image}: ${this.visitChildren(ctx)}`;
  }

  dims(ctx) {
    return this.visitChildren(ctx);
  }

  additionalBound(ctx) {
    return this.visitChildren(ctx);
  }

  ambiguousName(ctx) {
    return this.visitChildren(ctx);
  }

  annotation(ctx) {
    // TODO: annotations
    console.warn("annotations not implemented yet");
    return "";
    // return this.visitChildren(ctx);
  }

  annotationTypeBody(ctx) {
    return this.visitChildren(ctx);
  }

  annotationTypeDeclaration(ctx) {
    return this.visitChildren(ctx);
  }

  annotationTypeElementDeclaration(ctx) {
    return this.visitChildren(ctx);
  }

  annotationTypeElementModifier(ctx) {
    return this.visitChildren(ctx);
  }

  annotationTypeMemberDeclaration(ctx) {
    return this.visitChildren(ctx);
  }

  argumentList(ctx) {
    return this.visitChildren(ctx);
  }

  arrayAccessSuffix(ctx) {
    return this.visitChildren(ctx);
  }

  arrayCreationDefaultInitSuffix(ctx) {
    return this.visitChildren(ctx);
  }

  arrayCreationExplicitInitSuffix(ctx) {
    return this.visitChildren(ctx);
  }

  arrayCreationExpression(ctx) {
    return this.visitChildren(ctx);
  }

  arrayInitializer(ctx) {
    return this.visitChildren(ctx);
  }

  assertStatement(ctx) {
    return this.visitChildren(ctx);
  }

  basicForStatement(ctx) {
    return this.visitChildren(ctx);
  }

  binaryExpression(ctx) {
    return this.visitChildren(ctx);
  }

  block(ctx) {
    return this.visitChildren(ctx);
  }

  blockStatement(ctx) {
    return this.visitChildren(ctx);
  }

  blockStatements(ctx) {
    return this.visitChildren(ctx);
  }

  booleanLiteral(ctx) {
    return this.visitChildren(ctx);
  }

  breakStatement(ctx) {
    return this.visitChildren(ctx);
  }

  caseConstant(ctx) {
    return this.visitChildren(ctx);
  }

  castExpression(ctx) {
    return this.visitChildren(ctx);
  }

  catchClause(ctx) {
    return this.visitChildren(ctx);
  }

  catchFormalParameter(ctx) {
    return this.visitChildren(ctx);
  }

  catchType(ctx) {
    return this.visitChildren(ctx);
  }

  catches(ctx) {
    return this.visitChildren(ctx);
  }

  classLiteralSuffix(ctx) {
    return this.visitChildren(ctx);
  }

  classOrInterfaceType(ctx) {
    return this.visitChildren(ctx);
  }

  classOrInterfaceTypeToInstantiate(ctx) {
    return this.visitChildren(ctx);
  }

  classType(ctx) {
    return `${ctx.Identifier[0].image} `;
  }

  constantDeclaration(ctx) {
    return this.visitChildren(ctx);
  }

  constantModifier(ctx) {
    return this.visitChildren(ctx);
  }

  constructorBody(ctx) {
    return "";
  }

  constructorDeclaration(ctx) {
    return this.visitChildren(ctx);
  }

  constructorDeclarator(ctx) {
    return `constructor(${this.visitChildren(ctx, ["formalParameterList"])});`;
  }

  constructorModifier(ctx) {
    let modifierStr = "";
    for (const modifier in ctx) {
      switch (ctx[modifier][0].image) {
        case "public":
          break;
        case "private":
          modifierStr += "private ";
          break;
        case "protected":
          modifierStr += "protected ";
          break;
      }
    }
    return `${modifierStr}${this.visitChildren(ctx)}`;
  }

  continueStatement(ctx) {
    return this.visitChildren(ctx);
  }

  defaultValue(ctx) {
    return this.visitChildren(ctx);
  }

  diamond(ctx) {
    return this.visitChildren(ctx);
  }

  dimExpr(ctx) {
    return this.visitChildren(ctx);
  }

  dimExprs(ctx) {
    return this.visitChildren(ctx);
  }

  doStatement(ctx) {
    return this.visitChildren(ctx);
  }

  elementValue(ctx) {
    return this.visitChildren(ctx);
  }

  elementValueArrayInitializer(ctx) {
    return this.visitChildren(ctx);
  }

  elementValueList(ctx) {
    return this.visitChildren(ctx);
  }

  elementValuePair(ctx) {
    return this.visitChildren(ctx);
  }

  elementValuePairList(ctx) {
    return this.visitChildren(ctx);
  }

  emptyStatement(ctx) {
    return this.visitChildren(ctx);
  }

  enhancedForStatement(ctx) {
    return this.visitChildren(ctx);
  }

  enumBody(ctx) {
    return this.visitChildren(ctx);
  }

  enumBodyDeclarations(ctx) {
    return this.visitChildren(ctx);
  }

  enumConstant(ctx) {
    return this.visitChildren(ctx);
  }

  enumConstantList(ctx) {
    return this.visitChildren(ctx);
  }

  enumConstantModifier(ctx) {
    return this.visitChildren(ctx);
  }

  enumDeclaration(ctx) {
    return this.visitChildren(ctx);
  }

  exceptionType(ctx) {
    return this.visitChildren(ctx);
  }

  exceptionTypeList(ctx) {
    return this.visitChildren(ctx);
  }

  explicitConstructorInvocation(ctx) {
    return this.visitChildren(ctx);
  }

  explicitLambdaParameterList(ctx) {
    return this.visitChildren(ctx);
  }

  exportsModuleDirective(ctx) {
    return this.visitChildren(ctx);
  }

  expression(ctx) {
    return this.visitChildren(ctx);
  }

  expressionName(ctx) {
    return this.visitChildren(ctx);
  }

  expressionStatement(ctx) {
    return this.visitChildren(ctx);
  }

  extendsInterface(ctx) {
    return this.visitChildren(ctx);
  }

  extendsInterfaces(ctx) {
    return `extends ${this.visitChildren(ctx)}`;
  }

  fieldDeclaration(ctx) {
    return `${this.visitChildren(ctx, [
      "fieldModifier",
      "variableDeclaratorList",
      "unannType",
    ])};`;
  }

  fieldModifier(ctx) {
    let modifierStr = "";
    for (const modifier in ctx) {
      switch (ctx[modifier][0].image) {
        case "public":
          break;
        case "private":
          modifierStr += "private ";
          break;
        case "protected":
          modifierStr += "protected ";
          break;
        case "final":
          modifierStr += "readonly ";
          break;
        case "static":
          modifierStr += "static ";
          break;
        case "abstract":
          modifierStr += "abstract ";
          break;
      }
    }
    return `${modifierStr}${this.visitChildren(ctx)}`;
  }

  finally(ctx) {
    return this.visitChildren(ctx);
  }

  floatingPointLiteral(ctx) {
    return this.visitChildren(ctx);
  }

  floatingPointType(ctx) {
    return this.visitChildren(ctx);
  }

  forInit(ctx) {
    return this.visitChildren(ctx);
  }

  forStatement(ctx) {
    return this.visitChildren(ctx);
  }

  forUpdate(ctx) {
    return this.visitChildren(ctx);
  }

  fqnOrRefType(ctx) {
    return this.visitChildren(ctx);
  }

  fqnOrRefTypePartCommon(ctx) {
    return this.visitChildren(ctx);
  }

  fqnOrRefTypePartFirst(ctx) {
    return this.visitChildren(ctx);
  }

  fqnOrRefTypePartRest(ctx) {
    return this.visitChildren(ctx);
  }

  identifyAnnotationBodyDeclarationType(ctx) {
    return this.visitChildren(ctx);
  }

  identifyClassBodyDeclarationType(ctx) {
    return this.visitChildren(ctx);
  }

  identifyInterfaceBodyDeclarationType(ctx) {
    return this.visitChildren(ctx);
  }

  identifyNewExpressionType(ctx) {
    return this.visitChildren(ctx);
  }

  ifStatement(ctx) {
    return this.visitChildren(ctx);
  }

  importDeclaration(ctx) {
    return "";
    // return this.visitChildren(ctx);
  }

  inferredLambdaParameterList(ctx) {
    return this.visitChildren(ctx);
  }

  instanceInitializer(ctx) {
    return this.visitChildren(ctx);
  }

  integerLiteral(ctx) {
    return this.visitChildren(ctx);
  }

  integralType(ctx) {
    return this.visitChildren(ctx);
  }

  interfaceBody(ctx) {
    return `{\n${this.visitChildren(ctx)}}`;
    return this.visitChildren(ctx);
  }

  interfaceDeclaration(ctx) {
    return this.visitChildren(ctx);
  }

  interfaceMemberDeclaration(ctx) {
    return `${this.visitChildren(ctx)}\n`;
  }

  interfaceMethodDeclaration(ctx) {
    return this.visitChildren(ctx);
  }

  interfaceMethodModifier(ctx) {
    return this.visitChildren(ctx);
  }

  interfaceModifier(ctx) {
    let modifierStr = "";
    for (const modifier in ctx) {
      switch (ctx?.[modifier]?.[0]?.image) {
        case "abstract":
          modifierStr += "abstract ";
          break;
      }
    }
    return `${modifierStr}${this.visitChildren(ctx)}`;
  }

  interfaceType(ctx) {
    return this.visitChildren(ctx);
  }

  interfaceTypeList(ctx) {
    // add commas between each interface
    return this.visitChildren(ctx).replace(/ (?=[A-z])/g, ", ");
  }

  isBasicForStatement(ctx) {
    return this.visitChildren(ctx);
  }

  isCastExpression(ctx) {
    return this.visitChildren(ctx);
  }

  isClassDeclaration(ctx) {
    return this.visitChildren(ctx);
  }

  isClassicSwitchLabel(ctx) {
    return this.visitChildren(ctx);
  }

  isDims(ctx) {
    return this.visitChildren(ctx);
  }

  isLambdaExpression(ctx) {
    return this.visitChildren(ctx);
  }

  isLocalVariableDeclaration(ctx) {
    return this.visitChildren(ctx);
  }

  isModuleCompilationUnit(ctx) {
    return this.visitChildren(ctx);
  }

  isPrimitiveCastExpression(ctx) {
    return this.visitChildren(ctx);
  }

  isRefTypeInMethodRef(ctx) {
    return this.visitChildren(ctx);
  }

  isReferenceTypeCastExpression(ctx) {
    return this.visitChildren(ctx);
  }

  isSimpleElementValueAnnotation(ctx) {
    return this.visitChildren(ctx);
  }

  labeledStatement(ctx) {
    return this.visitChildren(ctx);
  }

  lambdaBody(ctx) {
    return this.visitChildren(ctx);
  }

  lambdaExpression(ctx) {
    return this.visitChildren(ctx);
  }

  lambdaParameter(ctx) {
    return this.visitChildren(ctx);
  }

  lambdaParameterList(ctx) {
    return this.visitChildren(ctx);
  }

  lambdaParameterType(ctx) {
    return this.visitChildren(ctx);
  }

  lambdaParameters(ctx) {
    return this.visitChildren(ctx);
  }

  lambdaParametersWithBraces(ctx) {
    return this.visitChildren(ctx);
  }

  literal(ctx) {
    return this.visitChildren(ctx);
  }

  localVariableDeclaration(ctx) {
    return this.visitChildren(ctx);
  }

  localVariableDeclarationStatement(ctx) {
    return this.visitChildren(ctx);
  }

  localVariableType(ctx) {
    return this.visitChildren(ctx);
  }

  methodBody(ctx) {
    return "";
    // return this.visitChildren(ctx);
  }

  methodInvocationSuffix(ctx) {
    return this.visitChildren(ctx);
  }

  methodName(ctx) {
    return this.visitChildren(ctx);
  }

  methodReferenceSuffix(ctx) {
    return this.visitChildren(ctx);
  }

  modularCompilationUnit(ctx) {
    return this.visitChildren(ctx);
  }

  moduleDeclaration(ctx) {
    return this.visitChildren(ctx);
  }

  moduleDirective(ctx) {
    return this.visitChildren(ctx);
  }

  moduleName(ctx) {
    return this.visitChildren(ctx);
  }

  newExpression(ctx) {
    return this.visitChildren(ctx);
  }

  normalInterfaceDeclaration(ctx) {
    return `interface ${this.visitChildren(ctx)}`;
  }

  numericType(ctx) {
    return "number";
  }

  opensModuleDirective(ctx) {
    return this.visitChildren(ctx);
  }

  packageDeclaration(ctx) {
    return "";
    // return this.visitChildren(ctx);
  }

  packageModifier(ctx) {
    return this.visitChildren(ctx);
  }

  packageName(ctx) {
    return this.visitChildren(ctx);
  }

  packageOrTypeName(ctx) {
    return this.visitChildren(ctx);
  }

  parenthesisExpression(ctx) {
    return this.visitChildren(ctx);
  }

  primary(ctx) {
    return this.visitChildren(ctx);
  }

  primaryPrefix(ctx) {
    return this.visitChildren(ctx);
  }

  primarySuffix(ctx) {
    return this.visitChildren(ctx);
  }

  primitiveCastExpression(ctx) {
    return this.visitChildren(ctx);
  }

  primitiveType(ctx) {
    return this.visitChildren(ctx);
  }

  providesModuleDirective(ctx) {
    return this.visitChildren(ctx);
  }

  qualifiedExplicitConstructorInvocation(ctx) {
    return this.visitChildren(ctx);
  }

  receiverParameter(ctx) {
    return this.visitChildren(ctx);
  }

  referenceType(ctx) {
    return this.visitChildren(ctx);
  }

  referenceTypeCastExpression(ctx) {
    return this.visitChildren(ctx);
  }

  regularLambdaParameter(ctx) {
    return this.visitChildren(ctx);
  }

  requiresModifier(ctx) {
    return this.visitChildren(ctx);
  }

  requiresModuleDirective(ctx) {
    return this.visitChildren(ctx);
  }

  resource(ctx) {
    return this.visitChildren(ctx);
  }

  resourceInit(ctx) {
    return this.visitChildren(ctx);
  }

  resourceList(ctx) {
    return this.visitChildren(ctx);
  }

  resourceSpecification(ctx) {
    return this.visitChildren(ctx);
  }

  returnStatement(ctx) {
    return this.visitChildren(ctx);
  }

  simpleTypeName(ctx) {
    return this.visitChildren(ctx);
  }

  statement(ctx) {
    return this.visitChildren(ctx);
  }

  statementExpression(ctx) {
    return this.visitChildren(ctx);
  }

  statementExpressionList(ctx) {
    return this.visitChildren(ctx);
  }

  statementWithoutTrailingSubstatement(ctx) {
    return this.visitChildren(ctx);
  }

  staticInitializer(ctx) {
    return this.visitChildren(ctx);
  }

  superclass(ctx) {
    return `extends ${this.visitChildren(ctx)}`;
  }

  superinterfaces(ctx) {
    return `implements ${this.visitChildren(ctx)}`;
  }

  switchBlock(ctx) {
    return this.visitChildren(ctx);
  }

  switchBlockStatementGroup(ctx) {
    return this.visitChildren(ctx);
  }

  switchLabel(ctx) {
    return this.visitChildren(ctx);
  }

  switchRule(ctx) {
    return this.visitChildren(ctx);
  }

  switchStatement(ctx) {
    return this.visitChildren(ctx);
  }

  synchronizedStatement(ctx) {
    return this.visitChildren(ctx);
  }

  ternaryExpression(ctx) {
    return this.visitChildren(ctx);
  }

  throwStatement(ctx) {
    return this.visitChildren(ctx);
  }

  throws(ctx) {
    return "";
  }

  tryStatement(ctx) {
    return this.visitChildren(ctx);
  }

  tryWithResourcesStatement(ctx) {
    return this.visitChildren(ctx);
  }

  typeArgument(ctx) {
    return this.visitChildren(ctx);
  }

  typeArgumentList(ctx) {
    return this.visitChildren(ctx);
  }

  typeArguments(ctx) {
    return this.visitChildren(ctx);
  }

  typeArgumentsOrDiamond(ctx) {
    return this.visitChildren(ctx);
  }

  typeBound(ctx) {
    return this.visitChildren(ctx);
  }

  typeName(ctx) {
    return this.visitChildren(ctx);
  }

  typeParameter(ctx) {
    return this.visitChildren(ctx);
  }

  typeParameterList(ctx) {
    return this.visitChildren(ctx);
  }

  typeParameterModifier(ctx) {
    return this.visitChildren(ctx);
  }

  typeParameters(ctx) {
    return this.visitChildren(ctx);
  }

  typeVariable(ctx) {
    return this.visitChildren(ctx);
  }

  unannInterfaceType(ctx) {
    return this.visitChildren(ctx);
  }

  unannPrimitiveType(ctx) {
    if (ctx?.Boolean) return "boolean ";
    return `${this.visitChildren(ctx)} `;
  }

  unannPrimitiveTypeWithOptionalDimsSuffix(ctx) {
    return this.visitChildren(ctx);
  }

  unannTypeVariable(ctx) {
    return this.visitChildren(ctx);
  }

  unaryExpression(ctx) {
    return this.visitChildren(ctx);
  }

  unaryExpressionNotPlusMinus(ctx) {
    return this.visitChildren(ctx);
  }

  unqualifiedClassInstanceCreationExpression(ctx) {
    return this.visitChildren(ctx);
  }

  unqualifiedExplicitConstructorInvocation(ctx) {
    return this.visitChildren(ctx);
  }

  usesModuleDirective(ctx) {
    return this.visitChildren(ctx);
  }

  validateVisitor(ctx) {
    return this.visitChildren(ctx);
  }

  variableAccess(ctx) {
    return this.visitChildren(ctx);
  }

  variableArityParameter(ctx) {
    return this.visitChildren(ctx);
  }

  variableDeclarator(ctx) {
    return this.visitChildren(ctx);
  }

  variableDeclaratorList(ctx) {
    return this.visitChildren(ctx);
  }

  variableInitializer(ctx) {
    return this.visitChildren(ctx);
  }

  variableInitializerList(ctx) {
    return this.visitChildren(ctx);
  }

  variableModifier(ctx) {
    return this.visitChildren(ctx);
  }

  whileStatement(ctx) {
    return this.visitChildren(ctx);
  }

  wildcard(ctx) {
    return this.visitChildren(ctx);
  }

  wildcardBounds(ctx) {
    return this.visitChildren(ctx);
  }

  yieldStatement(ctx) {
    return this.visitChildren(ctx);
  }
}

let out = new Visitor().visit(cst);
console.log(out);
