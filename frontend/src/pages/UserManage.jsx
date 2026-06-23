import { useState, useEffect } from 'react'
import api from '../store/useAuthStore'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { 
  Users, 
  Trash2, 
  UserPlus, 
  Shield, 
  Search, 
  Mail, 
  Calendar,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import Toast from '../components/ui/Toast'

export default function UserManage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users')
      setUsers(res.data)
    } catch (error) {
      setToast({ show: true, message: 'Failed to fetch users', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    try {
      await api.delete(`/users/${id}`)
      setToast({ show: true, message: 'User deleted successfully', type: 'success' })
      fetchUsers()
    } catch (error) {
      setToast({ show: true, message: 'Failed to delete user', type: 'error' })
    }
  }

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'student' : 'admin'
    try {
      await api.put(`/users/${user._id}/role`, { role: newRole })
      setToast({ show: true, message: `User promoted to ${newRole}`, type: 'success' })
      fetchUsers()
    } catch (error) {
      setToast({ show: true, message: 'Failed to update user role', type: 'error' })
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage platform access, roles, and monitor student activity.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-10 pr-4 py-3 bg-card border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card className="border-primary/5 shadow-sm overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-primary/5">
                <th className="p-5 text-xs font-black uppercase tracking-widest text-muted-foreground">User</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Role</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Joined At</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-muted-foreground">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-muted-foreground">No users found.</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-muted/20 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-5">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Toggle Role"
                        onClick={() => handleToggleRole(user)}
                        className="rounded-xl hover:text-purple-600 hover:bg-purple-50"
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Delete User"
                        onClick={() => handleDeleteUser(user._id)}
                        className="rounded-xl hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Toast 
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  )
}
