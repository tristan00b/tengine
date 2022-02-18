/** A `SceneGraph` tree-node for containing information pertaining to how meshes are drawn within a scene */
export class SceneNode
{
  protected _parent: SceneNode | null
  protected _children: SceneNode[]

  constructor()
  {
    this._parent = null
    this._children = []
  }

  get parent()
  {
    return this._parent
  }

  get children()
  {
    return this._children
  }

  setParent(parent: SceneNode)
  {
    this._parent = parent
    return this
  }

  addChild(...child: SceneNode[])
  {
    this._children.concat(child)
    return this
  }
}
