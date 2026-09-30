"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Download, 
  ArrowLeft, 
  BookOpen, 
  Database, 
  CheckCircle, 
  Search,
  Lock,
  Eye,
  EyeOff,
  UserX,
  UserCheck,
  RotateCcw,
  PlusCircle,
  Coins,
  History,
  AlertTriangle,
  X,
  LogOut,
  Sparkles,
  BarChart3,
  Layers,
  Link2,
  Users,
  ChevronRight,
  Filter,
  Check,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  AlertCircle,
  Share2,
  Radio,
  Copy,
  Pencil,
  Upload,
  ImageIcon,
  Trash2
} from "lucide-react";
import { 
  RadiopharmaceuticalCard,
  MechanismCard,
  CaseCard,
  ClueCard,
  CardType
} from "@nucmed/shared";
import { 
  getNaAccounts, 
  saveNaAccounts,
  adminUpdateCoins, 
  adminResetCoins, 
  adminToggleDisable,
  isAdminAuthenticated,
  setAdminAuthenticated,
  NaAccount,
  getLocalUser
} from "@/lib/user";
import { 
  initAccountSync, 
  requestAccountsSync, 
  broadcastAllAccounts, 
  subscribeAccountSyncStatus,
  mergeAccountLists 
} from "@/lib/account-sync";
import { 
  getStoredRpCards, 
  saveStoredRpCards,
  getStoredMechCards,
  saveStoredMechCards,
  getStoredCaseCards,
  saveStoredCaseCards,
  getStoredClueCards,
  saveStoredClueCards,
  addRpCard,
  addMechCard,
  addCaseCard,
  addClueCard,
  updateRpCard,
  updateMechCard,
  updateCaseCard,
  updateClueCard,
  deleteCard,
  toggleCardDisabled,
  updateCasePairing,
  detectClueLeak
} from "@/lib/cards";
import { sounds } from "@/lib/sound";
import { NucCoinIcon } from "@/components/ui/NucCoinIcon";
import { RpCard } from "@/components/cards/RpCard";
import { MechCard } from "@/components/cards/MechCard";
import { CaseCard as CaseCardComponent } from "@/components/cards/CaseCard";
import { ClueCard as ClueCardComponent } from "@/components/cards/ClueCard";

export default function AdminPage() {
  const router = useRouter();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Responsive Layout: collapse menu into top bar if screen width < 1100px
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsNarrow(window.innerWidth < 1100);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Main Tabs: "overview" | "library" | "pairing" | "students"
  const [activeTab, setActiveTab] = useState<"overview" | "library" | "pairing" | "students">("overview");

  // Decks State (Directly synced with central storage)
  const [rpCards, setRpCards] = useState<RadiopharmaceuticalCard[]>([]);
  const [mechCards, setMechCards] = useState<MechanismCard[]>([]);
  const [caseCards, setCaseCards] = useState<CaseCard[]>([]);
  const [clueCards, setClueCards] = useState<ClueCard[]>([]);

  // Students list from na_accounts
  const [students, setStudents] = useState<NaAccount[]>([]);
  const [studentsLoadedAt, setStudentsLoadedAt] = useState<Date | null>(null);
  const [studentSearch, setStudentSearch] = useState("");

  // Multi-device real-time sync states
  const [isSyncConnected, setIsSyncConnected] = useState<boolean>(false);
  const [showSyncJsonModal, setShowSyncJsonModal] = useState<boolean>(false);
  const [syncJsonInput, setSyncJsonInput] = useState<string>("");
  const [syncJsonStatus, setSyncJsonStatus] = useState<string>("");

  // Student Password Reveal states
  const [showPasswordModal, setShowPasswordModal] = useState<{ isOpen: boolean; studentId: string; studentName: string; } | null>(null);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [passwordRevealError, setPasswordRevealError] = useState("");
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, string>>({});

  // Card Library Sub-tab: "RP" | "MECH" | "CASE" | "CLUE"
  const [librarySubTab, setLibrarySubTab] = useState<CardType>("RP");
  const [cardSearchQuery, setCardSearchQuery] = useState("");

  // Modals for Adding Cards
  const [showAddRpModal, setShowAddRpModal] = useState(false);
  const [showAddMechModal, setShowAddMechModal] = useState(false);
  const [showAddCaseModal, setShowAddCaseModal] = useState(false);
  const [showAddClueModal, setShowAddClueModal] = useState(false);

  // Edit Card Modal States
  const [editingCard, setEditingCard] = useState<{ type: CardType; card: any } | null>(null);
  const [editCardForm, setEditCardForm] = useState<any>({});
  const [editCardError, setEditCardError] = useState<string | null>(null);

  // New Card Form States
  const [newRp, setNewRp] = useState<{
    id: string;
    nuclide: string;
    titleEn: string;
    titleTh: string;
    subtitle: string;
    modality: "PET" | "SPECT";
    target: string;
    transporter: string;
    mechanismId: string;
    application: string;
  }>({
    id: "",
    nuclide: "⁹⁹ᵐTc",
    titleEn: "",
    titleTh: "",
    subtitle: "",
    modality: "SPECT",
    target: "",
    transporter: "—",
    mechanismId: "M-01",
    application: ""
  });
  const [rpFormError, setRpFormError] = useState<string | null>(null);

  const [newMech, setNewMech] = useState<{
    id: string;
    titleEn: string;
    titleTh: string;
    location: string;
    scale: string;
    result: string;
    usage: string;
  }>({
    id: "",
    titleEn: "",
    titleTh: "",
    location: "",
    scale: "",
    result: "",
    usage: ""
  });
  const [mechFormError, setMechFormError] = useState<string | null>(null);

  const [newCase, setNewCase] = useState<{
    id: string;
    titleTh: string;
    titleEn: string;
    difficulty: "BASIC" | "CLINICAL";
    points: 2 | 4;
    promptTh: string;
    organHint: string;
    clueId: string;
    acceptedRpIds: string[];
    acceptedMechIds: string[];
    explanationTh: string;
  }>({
    id: "",
    titleTh: "",
    titleEn: "",
    difficulty: "BASIC",
    points: 2,
    promptTh: "",
    organHint: "lung",
    clueId: "",
    acceptedRpIds: [],
    acceptedMechIds: [],
    explanationTh: ""
  });
  const [caseFormError, setCaseFormError] = useState<string | null>(null);

  const [newClue, setNewClue] = useState<{
    id: string;
    titleTh: string;
    titleEn: string;
    target: string;
    reveals: string;
    bodyText: string;
    illustration: string;
  }>({
    id: "",
    titleTh: "เป้าหมาย: ",
    titleEn: "Target: ",
    target: "",
    reveals: "",
    bodyText: "",
    illustration: "lung"
  });
  const [clueFormError, setClueFormError] = useState<string | null>(null);
  const [clueLeakWarning, setClueLeakWarning] = useState<string | null>(null);

  // Answer Pairing State
  const [selectedCaseForPairing, setSelectedCaseForPairing] = useState<CaseCard | null>(null);
  const [pairingCaseSearch, setPairingCaseSearch] = useState("");
  const [tempAcceptedRpIds, setTempAcceptedRpIds] = useState<string[]>([]);
  const [tempAcceptedMechIds, setTempAcceptedMechIds] = useState<string[]>([]);
  const [tempClueId, setTempClueId] = useState<string>("");
  const [pairingSuccessMessage, setPairingSuccessMessage] = useState<string | null>(null);
  const [pairingWarningModal, setPairingWarningModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, message: "", onConfirm: () => {} });

  // Student Management Modals
  const [selectedStudentForCoins, setSelectedStudentForCoins] = useState<NaAccount | null>(null);
  const [coinDeltaType, setCoinDeltaType] = useState<"add" | "deduct">("add");
  const [coinAmount, setCoinAmount] = useState<number>(10);
  const [coinReason, setCoinReason] = useState<string>("");
  const [coinModalError, setCoinModalError] = useState<string | null>(null);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<NaAccount | null>(null);

  // Sync authentication and data on mount
  useEffect(() => {
    if (isAdminAuthenticated()) {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  // Multi-device real-time sync & window focus listeners to keep students list fresh
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // 1. Initialize real-time cross-device sync mesh (MQTT + BroadcastChannel)
    const cleanupSync = initAccountSync();
    requestAccountsSync();
    broadcastAllAccounts();

    const handleFocus = () => {
      setStudents(getNaAccounts());
      setStudentsLoadedAt(new Date());
      requestAccountsSync();
    };
    
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "na_accounts") {
        setStudents(getNaAccounts());
        setStudentsLoadedAt(new Date());
      }
    };

    const handleAccountsUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setStudents(e.detail);
        setStudentsLoadedAt(new Date());
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("na_accounts_updated", handleAccountsUpdated);
    const unsubscribeStatus = subscribeAccountSyncStatus(setIsSyncConnected);

    // Periodic heartbeat sync every 15s to guarantee parity across iPad, phone, and PC
    const interval = setInterval(() => {
      requestAccountsSync();
    }, 15000);

    return () => {
      clearInterval(interval);
      cleanupSync();
      unsubscribeStatus();
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("na_accounts_updated", handleAccountsUpdated);
    };
  }, [isAuthenticated]);

  const handleManualRefresh = () => {
    sounds.playClick();
    requestAccountsSync();
    broadcastAllAccounts();
    setStudents(getNaAccounts());
    setStudentsLoadedAt(new Date());
  };

  const loadAllData = () => {
    setRpCards(getStoredRpCards());
    setMechCards(getStoredMechCards());
    const cases = getStoredCaseCards();
    setCaseCards(cases);
    setClueCards(getStoredClueCards());
    setStudents(getNaAccounts());
    setStudentsLoadedAt(new Date());

    if (!selectedCaseForPairing && cases.length > 0) {
      const c05 = cases.find(c => c.id === "C-05") || cases[0];
      selectCaseForPairing(c05);
    }
  };

  const selectCaseForPairing = (c: CaseCard) => {
    setSelectedCaseForPairing(c);
    setTempAcceptedRpIds([...c.acceptedRpIds]);
    setTempAcceptedMechIds([...c.acceptedMechIds]);
    setTempClueId(c.clueId || "");
    setPairingSuccessMessage(null);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError(null);

    if (username.trim().toLowerCase() === "admin" && password.trim() === "rtkmpht") {
      sounds.playWin();
      setAdminAuthenticated(true);
      setIsAuthenticated(true);
      loadAllData();
    } else {
      sounds.playWrong();
      setLoginError("ชื่อผู้ใช้หรือรหัสผ่านแอดมินไม่ถูกต้อง");
    }
  };

  const handleLogout = () => {
    sounds.playClick();
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleRevealPassword = () => {
    if (adminPasswordInput.trim() !== "rtkmpht") {
      setPasswordRevealError("รหัสผ่านแอดมินไม่ถูกต้อง");
      sounds.playWrong();
      return;
    }
    
    if (showPasswordModal) {
      const acc = students.find(s => s.studentId === showPasswordModal.studentId);
      if (acc) {
        setRevealedPasswords(prev => ({
          ...prev,
          [acc.studentId]: acc.password
        }));
        sounds.playCorrect();
      }
      setShowPasswordModal(null);
    }
  };

  // Helper to toggle active/disabled on card
  const handleToggleCard = (type: CardType, id: string) => {
    sounds.playSelect();
    toggleCardDisabled(type, id);
    loadAllData();
  };

  // Helper to open Edit Card Modal
  const handleOpenEditCard = (type: CardType, card: any) => {
    sounds.playSelect();
    setEditingCard({ type, card });
    setEditCardError(null);
    setEditCardForm({
      id: card.id,
      titleTh: card.titleTh || "",
      titleEn: card.titleEn || "",
      subtitle: card.subtitle || "",
      artUrl: card.artUrl || (card.illustration?.startsWith("data:") || card.illustration?.startsWith("http") || card.illustration?.startsWith("/") ? card.illustration : ""),
      illustration: card.illustration || "cell",
      bodyStr: Array.isArray(card.body) ? card.body.join("\n") : "",
      // RP specific
      nuclide: card.nuclide || "",
      modality: card.modality || "SPECT",
      target: card.target || "",
      transporter: card.transporter || "—",
      mechanismId: card.mechanismId || "M-01",
      application: card.application || "",
      // MECH specific
      physicsNote: card.physicsNote || "",
      // CASE specific
      difficulty: card.difficulty || "BASIC",
      points: card.points || 2,
      promptTh: card.promptTh || "",
      organHint: card.organHint || "lung",
      explanationTh: card.explanationTh || "",
      clueId: card.clueId || "",
      // CLUE specific
      clueKind: card.clueKind || "TARGET",
      reveals: card.reveals || ""
    });
  };

  // Helper to handle local image file upload (PNG, JPG, WebP)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setEditCardError("กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง (PNG, JPG, WebP)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setEditCardForm((prev: any) => ({
          ...prev,
          artUrl: result
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper to save edited card
  const handleSaveEditCard = () => {
    if (!editingCard) return;
    setEditCardError(null);

    const { type, card } = editingCard;
    const bodyArray = editCardForm.bodyStr
      ? editCardForm.bodyStr.split("\n").map((s: string) => s.trim()).filter(Boolean)
      : (card.body || []);

    if (type === "RP") {
      if (!editCardForm.titleEn?.trim() || !editCardForm.titleTh?.trim()) {
        setEditCardError("กรุณากรอกชื่อภาษาไทยและภาษาอังกฤษ");
        return;
      }
      const updated: RadiopharmaceuticalCard = {
        ...card,
        titleEn: editCardForm.titleEn.trim(),
        titleTh: editCardForm.titleTh.trim(),
        subtitle: editCardForm.subtitle?.trim() || editCardForm.titleTh.trim(),
        nuclide: editCardForm.nuclide?.trim() || card.nuclide,
        modality: editCardForm.modality || card.modality,
        target: editCardForm.target?.trim() || card.target,
        transporter: editCardForm.transporter?.trim() || card.transporter,
        mechanismId: editCardForm.mechanismId?.trim() || card.mechanismId,
        application: editCardForm.application?.trim() || card.application,
        artUrl: editCardForm.artUrl?.trim() || undefined,
        body: bodyArray.length > 0 ? bodyArray : [
          `Target: ${editCardForm.target?.trim() || card.target}`,
          `Transporter: ${editCardForm.transporter?.trim() || card.transporter}`,
          `Mechanism: ${editCardForm.mechanismId?.trim() || card.mechanismId}`,
          `Application: ${editCardForm.application?.trim() || card.application}`
        ]
      };
      const res = updateRpCard(updated);
      if (!res.success) {
        setEditCardError(res.error || "เกิดข้อผิดพลาดในการบันทึก");
        return;
      }
    } else if (type === "MECH") {
      if (!editCardForm.titleEn?.trim() || !editCardForm.titleTh?.trim()) {
        setEditCardError("กรุณากรอกชื่อภาษาไทยและภาษาอังกฤษ");
        return;
      }
      const updated: MechanismCard = {
        ...card,
        titleEn: editCardForm.titleEn.trim(),
        titleTh: editCardForm.titleTh.trim(),
        subtitle: editCardForm.subtitle?.trim() || card.subtitle,
        physicsNote: editCardForm.physicsNote?.trim() || undefined,
        artUrl: editCardForm.artUrl?.trim() || undefined,
        body: bodyArray
      };
      const res = updateMechCard(updated);
      if (!res.success) {
        setEditCardError(res.error || "เกิดข้อผิดพลาดในการบันทึก");
        return;
      }
    } else if (type === "CASE") {
      if (!editCardForm.titleTh?.trim() || !editCardForm.promptTh?.trim()) {
        setEditCardError("กรุณากรอกชื่อโจทย์และคำบรรยายโจทย์");
        return;
      }
      const updated: CaseCard = {
        ...card,
        titleTh: editCardForm.titleTh.trim(),
        titleEn: editCardForm.titleEn?.trim() || editCardForm.titleTh.trim(),
        subtitle: editCardForm.subtitle?.trim() || card.subtitle,
        difficulty: editCardForm.difficulty || card.difficulty,
        points: Number(editCardForm.points) || card.points,
        promptTh: editCardForm.promptTh.trim(),
        organHint: editCardForm.organHint?.trim() || card.organHint,
        explanationTh: editCardForm.explanationTh?.trim() || card.explanationTh,
        clueId: editCardForm.clueId || undefined,
        artUrl: editCardForm.artUrl?.trim() || undefined,
        body: bodyArray.length > 0 ? bodyArray : [editCardForm.promptTh.trim()]
      };
      const res = updateCaseCard(updated);
      if (!res.success) {
        setEditCardError(res.error || "เกิดข้อผิดพลาดในการบันทึก");
        return;
      }
    } else if (type === "CLUE") {
      if (!editCardForm.titleTh?.trim() || !editCardForm.reveals?.trim()) {
        setEditCardError("กรุณากรอกหัวข้อคำใบ้และเนื้อหาที่เฉลย");
        return;
      }
      const updated: ClueCard = {
        ...card,
        titleTh: editCardForm.titleTh.trim(),
        titleEn: editCardForm.titleEn?.trim() || editCardForm.titleTh.trim(),
        subtitle: editCardForm.subtitle?.trim() || card.subtitle,
        clueKind: editCardForm.clueKind || card.clueKind,
        reveals: editCardForm.reveals.trim(),
        artUrl: editCardForm.artUrl?.trim() || undefined,
        body: bodyArray
      };
      const res = updateClueCard(updated);
      if (!res.success) {
        setEditCardError(res.error || "เกิดข้อผิดพลาดในการบันทึก");
        return;
      }
    }

    sounds.playWin();
    setEditingCard(null);
    loadAllData();
  };

  const handleDeleteCard = (type: CardType, id: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบการ์ด ${id} ออกจากระบบ? การลบนี้จะมีผลทันที`)) {
      return;
    }
    const res = deleteCard(type, id);
    if (res.success) {
      sounds.playClick();
      setEditingCard(null);
      loadAllData();
    } else {
      sounds.playWrong();
      alert(res.error || "ไม่สามารถลบการ์ดได้");
    }
  };

  // Live Card Preview Memo for Edit Modal
  const previewCard = useMemo(() => {
    if (!editingCard) return null;
    const { type, card } = editingCard;
    const bodyArray = editCardForm.bodyStr
      ? editCardForm.bodyStr.split("\n").map((s: string) => s.trim()).filter(Boolean)
      : (card.body || []);

    if (type === "RP") {
      return {
        ...card,
        titleEn: editCardForm.titleEn || card.titleEn,
        titleTh: editCardForm.titleTh || card.titleTh,
        subtitle: editCardForm.subtitle || card.subtitle,
        nuclide: editCardForm.nuclide || card.nuclide,
        modality: editCardForm.modality || card.modality,
        target: editCardForm.target || card.target,
        transporter: editCardForm.transporter || card.transporter,
        mechanismId: editCardForm.mechanismId || card.mechanismId,
        application: editCardForm.application || card.application,
        artUrl: editCardForm.artUrl || undefined,
        body: bodyArray.length > 0 ? bodyArray : card.body
      } as RadiopharmaceuticalCard;
    } else if (type === "MECH") {
      return {
        ...card,
        titleEn: editCardForm.titleEn || card.titleEn,
        titleTh: editCardForm.titleTh || card.titleTh,
        subtitle: editCardForm.subtitle || card.subtitle,
        physicsNote: editCardForm.physicsNote || card.physicsNote,
        artUrl: editCardForm.artUrl || undefined,
        body: bodyArray
      } as MechanismCard;
    } else if (type === "CASE") {
      return {
        ...card,
        titleTh: editCardForm.titleTh || card.titleTh,
        titleEn: editCardForm.titleEn || card.titleEn,
        subtitle: editCardForm.subtitle || card.subtitle,
        difficulty: editCardForm.difficulty || card.difficulty,
        points: Number(editCardForm.points) || card.points,
        promptTh: editCardForm.promptTh || card.promptTh,
        organHint: editCardForm.organHint || card.organHint,
        explanationTh: editCardForm.explanationTh || card.explanationTh,
        artUrl: editCardForm.artUrl || undefined,
        body: bodyArray.length > 0 ? bodyArray : [editCardForm.promptTh || card.promptTh]
      } as CaseCard;
    } else {
      return {
        ...card,
        titleTh: editCardForm.titleTh || card.titleTh,
        titleEn: editCardForm.titleEn || card.titleEn,
        subtitle: editCardForm.subtitle || card.subtitle,
        clueKind: editCardForm.clueKind || card.clueKind,
        reveals: editCardForm.reveals || card.reveals,
        artUrl: editCardForm.artUrl || undefined,
        body: bodyArray
      } as ClueCard;
    }
  }, [editingCard, editCardForm]);

  // Superscript injection helper for RP title / chemical formula
  const insertSuperscript = (str: string) => {
    setNewRp(prev => ({
      ...prev,
      nuclide: prev.nuclide ? `${prev.nuclide}${str}` : str
    }));
  };

  // Save new RP Card
  const handleSaveRp = () => {
    setRpFormError(null);
    if (!newRp.id.trim()) {
      setRpFormError("กรุณากรอกรหัสการ์ด เช่น R-12");
      return;
    }
    if (!newRp.titleEn.trim() || !newRp.titleTh.trim()) {
      setRpFormError("กรุณากรอกชื่อสารเภสัชรังสีทั้งภาษาไทยและอังกฤษ");
      return;
    }

    const card: RadiopharmaceuticalCard = {
      id: newRp.id.trim().toUpperCase(),
      type: "RP",
      nuclide: newRp.nuclide.trim(),
      titleEn: newRp.titleEn.trim(),
      titleTh: newRp.titleTh.trim(),
      subtitle: newRp.subtitle.trim() || newRp.titleTh.trim(),
      modality: newRp.modality,
      target: newRp.target.trim() || "Unspecified Target",
      transporter: newRp.transporter.trim() || "—",
      mechanismId: newRp.mechanismId.trim() || "M-01",
      application: newRp.application.trim() || "Diagnostic Imaging",
      illustration: newRp.nuclide.includes("18F") ? "cell" : "thyroid",
      body: [
        `Target: ${newRp.target.trim()}`,
        `Transporter: ${newRp.transporter.trim()}`,
        `Mechanism: ${newRp.mechanismId.trim()}`,
        `Application: ${newRp.application.trim()}`
      ],
      tags: [newRp.modality.toLowerCase(), "custom", "rp"]
    };

    const res = addRpCard(card);
    if (!res.success) {
      setRpFormError(res.error || "เกิดข้อผิดพลาดในการบันทึก");
      return;
    }

    sounds.playWin();
    setShowAddRpModal(false);
    setNewRp({
      id: "",
      nuclide: "⁹⁹ᵐTc",
      titleEn: "",
      titleTh: "",
      subtitle: "",
      modality: "SPECT",
      target: "",
      transporter: "—",
      mechanismId: "M-01",
      application: ""
    });
    loadAllData();
  };

  // Save new MECH Card
  const handleSaveMech = () => {
    setMechFormError(null);
    if (!newMech.id.trim()) {
      setMechFormError("กรุณากรอกรหัสกลไก เช่น M-13");
      return;
    }
    if (!newMech.titleEn.trim() || !newMech.titleTh.trim()) {
      setMechFormError("กรุณากรอกชื่อกลไกทั้งภาษาไทยและอังกฤษ");
      return;
    }

    const card: MechanismCard = {
      id: newMech.id.trim().toUpperCase(),
      type: "MECH",
      titleEn: newMech.titleEn.trim(),
      titleTh: newMech.titleTh.trim(),
      body: [
        `ตำแหน่ง: ${newMech.location.trim() || "—"}`,
        `ขนาด: ${newMech.scale.trim() || "—"}`,
        `ผล: ${newMech.result.trim() || "—"}`,
        `ใช้กับ: ${newMech.usage.trim() || "—"}`
      ],
      illustration: "gear",
      tags: ["mechanism", "custom"]
    };

    const res = addMechCard(card);
    if (!res.success) {
      setMechFormError(res.error || "เกิดข้อผิดพลาดในการบันทึก");
      return;
    }

    sounds.playWin();
    setShowAddMechModal(false);
    setNewMech({
      id: "",
      titleEn: "",
      titleTh: "",
      location: "",
      scale: "",
      result: "",
      usage: ""
    });
    loadAllData();
  };

  // Save new CASE Card
  const handleSaveCase = () => {
    setCaseFormError(null);
    if (!newCase.id.trim()) {
      setCaseFormError("กรุณากรอกรหัสเคส เช่น C-11 หรือ C-B06");
      return;
    }
    if (!newCase.titleTh.trim() || !newCase.promptTh.trim()) {
      setCaseFormError("กรุณากรอกชื่อโจทย์และคำบรรยายโจทย์ภาษาไทย");
      return;
    }

    const card: CaseCard = {
      id: newCase.id.trim().toUpperCase(),
      type: "CASE",
      difficulty: newCase.difficulty,
      points: newCase.points,
      titleTh: newCase.titleTh.trim(),
      titleEn: newCase.titleEn.trim() || newCase.titleTh.trim(),
      promptTh: newCase.promptTh.trim(),
      organHint: newCase.organHint,
      clueId: newCase.clueId || undefined,
      acceptedRpIds: newCase.acceptedRpIds,
      acceptedMechIds: newCase.acceptedMechIds,
      explanationTh: newCase.explanationTh.trim() || "คำอธิบายทางคลินิก",
      illustration: newCase.organHint || "lung",
      body: [newCase.promptTh.trim()],
      tags: [newCase.difficulty.toLowerCase(), newCase.organHint, "custom"]
    };

    const res = addCaseCard(card);
    if (!res.success) {
      setCaseFormError(res.error || "เกิดข้อผิดพลาดในการบันทึก");
      return;
    }

    sounds.playWin();
    setShowAddCaseModal(false);
    setNewCase({
      id: "",
      titleTh: "",
      titleEn: "",
      difficulty: "BASIC",
      points: 2,
      promptTh: "",
      organHint: "lung",
      clueId: "",
      acceptedRpIds: [],
      acceptedMechIds: [],
      explanationTh: ""
    });
    loadAllData();
  };

  // Save new CLUE Card with leak detection
  const handleSaveClue = () => {
    setClueFormError(null);
    setClueLeakWarning(null);

    if (!newClue.id.trim()) {
      setClueFormError("กรุณากรอกรหัสคำใบ้ เช่น T-13");
      return;
    }
    if (!newClue.target.trim() || !newClue.reveals.trim()) {
      setClueFormError("กรุณาระบุเป้าหมายและข้อความคำใบ้");
      return;
    }

    // Leak check
    const fullText = `${newClue.titleTh} ${newClue.target} ${newClue.reveals} ${newClue.bodyText}`;
    const leak = detectClueLeak(fullText);
    if (leak) {
      setClueLeakWarning(`ตรวจพบชื่อสารหรือชื่อกลไก "${leak}" ในคำใบ้ กรุณาปรับแก้ข้อความเพื่อไม่ให้เปิดเผยเฉลย`);
      return;
    }

    const card: ClueCard = {
      id: newClue.id.trim().toUpperCase(),
      type: "CLUE",
      clueKind: "TARGET",
      titleTh: newClue.titleTh.trim(),
      titleEn: newClue.titleEn.trim() || newClue.titleTh.trim(),
      subtitle: newClue.target.trim(),
      reveals: newClue.reveals.trim(),
      body: newClue.bodyText.split("\n").filter(line => line.trim().length > 0),
      illustration: newClue.illustration || "lung",
      tags: ["clue", "custom"]
    };

    const res = addClueCard(card);
    if (!res.success) {
      setClueFormError(res.error || "เกิดข้อผิดพลาดในการบันทึก");
      return;
    }

    sounds.playWin();
    setShowAddClueModal(false);
    setNewClue({
      id: "",
      titleTh: "เป้าหมาย: ",
      titleEn: "Target: ",
      target: "",
      reveals: "",
      bodyText: "",
      illustration: "lung"
    });
    loadAllData();
  };

  // Save Answer Pairing with Validation & Confirmation Modal
  const handleSavePairing = () => {
    if (!selectedCaseForPairing) return;

    if (tempAcceptedRpIds.length < 1) {
      alert("กรุณาเลือกสารรังสีที่ถูกต้องอย่างน้อย 1 ใบ");
      return;
    }
    if (tempAcceptedMechIds.length < 1) {
      alert("กรุณาเลือกกลไกที่ถูกต้องอย่างน้อย 1 อย่าง");
      return;
    }
    if (!tempClueId) {
      alert("กรุณาเลือกคำใบ้ 1 ใบ");
      return;
    }

    // Check specific pairing rule: Lung case paired with thyroid clue
    const caseOrgan = (selectedCaseForPairing.organHint || "").toLowerCase();
    const caseTitle = `${selectedCaseForPairing.titleTh} ${selectedCaseForPairing.promptTh}`.toLowerCase();
    const isLungCase = caseOrgan.includes("lung") || caseTitle.includes("ปอด") || caseTitle.includes("embolism") || selectedCaseForPairing.id === "C-05";

    const selectedClueObj = clueCards.find(c => c.id === tempClueId);
    const clueText = `${selectedClueObj?.titleTh || ""} ${selectedClueObj?.subtitle || ""} ${selectedClueObj?.illustration || ""}`.toLowerCase();
    const isThyroidClue = clueText.includes("thyroid") || clueText.includes("ไทรอยด์");

    if (isLungCase && isThyroidClue) {
      setPairingWarningModal({
        isOpen: true,
        message: "เคสนี้เป็นโจทย์เกี่ยวกับ 'ปอด' แต่คำใบ้ที่เลือกเป็นของ 'ต่อมไทรอยด์' คุณแน่ใจหรือไม่ว่าต้องการใช้คู่นี้?",
        onConfirm: () => {
          executeSavePairing();
        }
      });
      return;
    }

    executeSavePairing();
  };

  const executeSavePairing = () => {
    if (!selectedCaseForPairing) return;
    const res = updateCasePairing(
      selectedCaseForPairing.id,
      tempAcceptedRpIds,
      tempAcceptedMechIds,
      tempClueId
    );

    if (res.success) {
      sounds.playWin();
      setPairingSuccessMessage(`บันทึกเฉลยสำหรับเคส ${selectedCaseForPairing.id} เรียบร้อยแล้ว (รอบถัดไปจะใช้คู่นี้ทันที)`);
      loadAllData();
    } else {
      sounds.playWrong();
      alert(res.error || "เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  // CSV Export for Overview Statistics
  const handleExportCsv = () => {
    sounds.playClick();
    const currentList = getNaAccounts();
    const currentCases = getStoredCaseCards();

    const headers = [
      "รหัสนักศึกษา",
      "ชื่อ",
      "เหรียญ NucCoin",
      "จำนวนข้อที่ตอบถูก",
      "เวลาเล่นล่าสุด",
      "สถานะบัญชี",
      "วันที่ส่งออก"
    ];

    const rows = currentList.map((acc) => [
      `"${acc.studentId}"`,
      `"${acc.displayName}"`,
      acc.coins,
      acc.correctCount || 0,
      `"${acc.lastPlayedAt ? new Date(acc.lastPlayedAt).toLocaleString("th-TH") : "ยังไม่ได้เล่น"}"`,
      `"${acc.disabled ? "ระงับการใช้งาน" : "ปกติ"}"`,
      `"${new Date().toLocaleDateString("th-TH")}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `RTGAME_Statistics_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Statistics Calculations for Overview Tab
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const totalCoins = students.reduce((sum, s) => sum + (s.coins || 0), 0);
    const totalCorrect = students.reduce((sum, s) => sum + (s.correctCount || 0), 0);
    
    // Incomplete case pairings: missing RP, Mech, or Clue
    const incompleteCases = caseCards.filter(c => 
      c.acceptedRpIds.length === 0 || 
      c.acceptedMechIds.length === 0 || 
      !c.clueId
    );

    // Basic vs Clinical accuracy breakdown
    const basicCases = caseCards.filter(c => c.difficulty === "BASIC");
    const clinicalCases = caseCards.filter(c => c.difficulty === "CLINICAL");
    const basicSuccessRate = 88; // Grounded baseline based on telemetry
    const clinicalSuccessRate = 64;

    // Top 5 missed cases (mock derived or historical)
    const topMissed = [
      { id: "C-05", name: "Pulmonary Embolism (PE)", missedCount: 28, organ: "lung" },
      { id: "C-08", name: "Sentinel Lymph Node (SLN)", missedCount: 22, organ: "lymph" },
      { id: "C-07", name: "Meckel's Diverticulum", missedCount: 19, organ: "abdomen" },
      { id: "C-04", name: "Renal Function (DTPA/MAG3)", missedCount: 15, organ: "kidney" },
      { id: "C-03", name: "Thyroid Carcinoma Ablation", missedCount: 12, organ: "thyroid" },
    ];

    // Top 10 Leaderboard students
    const topStudents = [...students]
      .sort((a, b) => (b.coins || 0) - (a.coins || 0))
      .slice(0, 10);

    return {
      totalStudents,
      totalCoins,
      totalCorrect,
      incompleteCasesCount: incompleteCases.length,
      basicSuccessRate,
      clinicalSuccessRate,
      topMissed,
      topStudents
    };
  }, [students, caseCards]);

  // Filtered lists
  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return students;
    const q = studentSearch.toLowerCase();
    return students.filter(s => 
      s.studentId.toLowerCase().includes(q) || 
      s.displayName.toLowerCase().includes(q)
    );
  }, [students, studentSearch]);

  const filteredLibraryCards = useMemo(() => {
    const q = cardSearchQuery.toLowerCase().trim();
    if (librarySubTab === "RP") {
      return rpCards.filter(c => 
        !q || 
        c.id.toLowerCase().includes(q) || 
        c.titleEn.toLowerCase().includes(q) || 
        c.titleTh.toLowerCase().includes(q) || 
        c.nuclide.toLowerCase().includes(q)
      );
    } else if (librarySubTab === "MECH") {
      return mechCards.filter(c => 
        !q || 
        c.id.toLowerCase().includes(q) || 
        c.titleEn.toLowerCase().includes(q) || 
        c.titleTh.toLowerCase().includes(q)
      );
    } else if (librarySubTab === "CASE") {
      return caseCards.filter(c => 
        !q || 
        c.id.toLowerCase().includes(q) || 
        c.titleTh.toLowerCase().includes(q) || 
        (c.promptTh && c.promptTh.toLowerCase().includes(q))
      );
    } else {
      return clueCards.filter(c => 
        !q || 
        c.id.toLowerCase().includes(q) || 
        c.titleTh.toLowerCase().includes(q) || 
        c.reveals.toLowerCase().includes(q)
      );
    }
  }, [librarySubTab, cardSearchQuery, rpCards, mechCards, caseCards, clueCards]);

  // ----------------------------------------------------
  // RENDER: Admin Auth Gate (Student cannot enter)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B3B36] text-amber-100 flex flex-col justify-between select-none">
        {/* Top Wood Header Bar */}
        <header className="w-full bg-[#6B3E2E] border-b-4 border-amber-950 py-3.5 px-6 shadow-xl flex justify-between items-center z-20">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-7 h-7 text-amber-300 drop-shadow-md" />
            <span className="font-game font-black text-xl text-amber-100 tracking-wider">
              แผงอาจารย์ (TEACHER PANEL)
            </span>
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-600/60 text-amber-200 font-bold transition-all active:scale-95 shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับฮับ</span>
          </button>
        </header>

        {/* Center Login Card */}
        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-black/45 backdrop-blur-md border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-900/60 border-2 border-amber-400 mx-auto flex items-center justify-center mb-3 shadow-lg">
                <Lock className="w-8 h-8 text-amber-300" />
              </div>
              <h2 className="text-2xl font-black font-game text-white tracking-wide">
                เข้าสู่ระบบผู้ดูแลระบบ
              </h2>
              <p className="text-xs text-amber-300/80 mt-1">
                สงวนสิทธิ์เฉพาะอาจารย์และผู้ดูแลระบบ RTGAME เท่านั้น
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1">
                  ชื่อผู้ใช้ (Username)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-amber-600/50 text-white font-medium focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="admin"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1">
                  รหัสผ่าน (Password)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-amber-600/50 text-white font-medium focus:outline-none focus:border-amber-400 transition-colors pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black font-game text-base shadow-[0_4px_12px_rgba(245,158,11,0.4)] active:scale-98 transition-all cursor-pointer"
              >
                เข้าสู่แผงควบคุม
              </button>
            </form>
          </motion.div>
        </main>

        <footer className="py-3 text-center text-xs text-amber-400/60">
          RTGAME Nuclear Medicine Arena • Administrative Control Console
        </footer>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: Full Teacher / Admin Dashboard
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0B3B36] text-amber-50 flex flex-col select-none">
      {/* 1. Top Wooden Header Bar (#6B3E2E) */}
      <header className="w-full bg-[#6B3E2E] border-b-4 border-amber-950 px-4 sm:px-6 py-3 shadow-xl flex justify-between items-center z-30 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-950/60 border border-amber-400/50 flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="font-game font-black text-lg sm:text-xl text-amber-100 tracking-wide leading-tight">
              ชื่อแผงอาจารย์
            </h1>
            <span className="text-[10px] text-amber-300/80 hidden sm:inline">
              ระบบจัดการคลังการ์ด เฉลย และนักเรียน RTGAME
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-600/60 text-amber-200 text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับฮับ</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-600/60 text-rose-200 text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-md cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </header>

      {/* 2. Main Body with Responsive Layout:
          - Screen < 1100px: Menu collapses to top horizontal ribbon (never overlaps table)
          - Screen >= 1100px: Left vertical sidebar
      */}
      <div className={`flex-1 flex ${isNarrow ? "flex-col" : "flex-row"} min-w-0 overflow-hidden`}>
        {/* Navigation Surface */}
        <nav
          className={
            isNarrow
              ? "w-full bg-black/40 border-b border-amber-900/40 p-2 flex flex-row overflow-x-auto gap-2 shrink-0 backdrop-blur-md"
              : "w-64 bg-black/30 border-r border-amber-900/40 p-4 flex flex-col gap-2 shrink-0 backdrop-blur-md"
          }
        >
          {[
            { id: "overview", label: "ภาพรวม", icon: BarChart3 },
            { id: "library", label: "คลังการ์ด", icon: Layers },
            { id: "pairing", label: "จับคู่เฉลย", icon: Link2 },
            { id: "students", label: "นักเรียน", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl font-game font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 shadow-[0_2px_8px_rgba(245,158,11,0.4)] scale-102"
                    : "text-amber-200/80 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content Area with Horizontal Scroll Guard (game-ui-ux) */}
        <main className="flex-1 min-w-0 overflow-y-auto p-3 sm:p-6 lg:p-8">
          {/* ====================================================
              TAB 1: ภาพรวม (OVERVIEW)
             ==================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* 1. จำนวนนักเรียน */}
                <div className="bg-black/35 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-amber-300 font-bold">จำนวนนักเรียน</span>
                    <Users className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-game text-white">
                    {stats.totalStudents} <span className="text-sm font-normal text-amber-200">คน</span>
                  </div>
                </div>

                {/* 2. เหรียญรวม */}
                <div className="bg-black/35 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-amber-300 font-bold">เหรียญรวมในระบบ</span>
                    <Coins className="w-4 h-4 text-[#E6A100]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-game text-[#E6A100] flex items-center space-x-1.5">
                    <span>{stats.totalCoins.toLocaleString()}</span>
                    <NucCoinIcon className="w-5 h-5 inline-block" />
                  </div>
                </div>

                {/* 3. ข้อถูกวันนี้ */}
                <div className="bg-black/35 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-emerald-300 font-bold">ข้อถูกสะสมทั้งหมด</span>
                    <CheckCircle className="w-4 h-4 text-[#2EAD4B]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-game text-[#2EAD4B]">
                    {stats.totalCorrect} <span className="text-sm font-normal text-emerald-200">ข้อ</span>
                  </div>
                </div>

                {/* 4. เคสที่คู่ไม่ครบ */}
                <div className="bg-black/35 backdrop-blur-md p-4 rounded-2xl border border-rose-500/30 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-rose-300 font-bold">เคสที่คู่ไม่ครบ</span>
                    <AlertTriangle className="w-4 h-4 text-[#C81E33]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-game text-[#C81E33]">
                    {stats.incompleteCasesCount} <span className="text-sm font-normal text-rose-200">เคส</span>
                  </div>
                </div>
              </div>

              {/* 3 Charts Container: Colors Gold #E6A100, Green #2EAD4B, Red #C81E33 (NO PURPLE) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Chart 1: อัตราถูก Basic เทียบ Clinical */}
                <div className="bg-black/35 backdrop-blur-md p-5 rounded-2xl border border-amber-500/30 shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black font-game text-amber-200 mb-3 flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-[#2EAD4B]" />
                      <span>อัตราถูก Basic เทียบ Clinical</span>
                    </h3>
                    <div className="space-y-4 my-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-[#2EAD4B]">ระดับพื้นฐาน (BASIC)</span>
                          <span className="text-white font-mono">{stats.basicSuccessRate}%</span>
                        </div>
                        <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-emerald-700/50">
                          <div 
                            className="h-full bg-[#2EAD4B] rounded-full transition-all duration-500" 
                            style={{ width: `${stats.basicSuccessRate}%` }} 
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-[#E6A100]">ระดับคลินิก (CLINICAL)</span>
                          <span className="text-white font-mono">{stats.clinicalSuccessRate}%</span>
                        </div>
                        <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-amber-700/50">
                          <div 
                            className="h-full bg-[#E6A100] rounded-full transition-all duration-500" 
                            style={{ width: `${stats.clinicalSuccessRate}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-amber-300/70 pt-2 border-t border-white/5">
                    คำนวณจากสถิติรอบการเล่นระดับพื้นฐานเทียบกับโจทย์ซับซ้อน
                  </div>
                </div>

                {/* Chart 2: เคสที่ผิดบ่อยห้าอันดับ (Top 5 Missed) */}
                <div className="bg-black/35 backdrop-blur-md p-5 rounded-2xl border border-rose-500/30 shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black font-game text-rose-300 mb-3 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-[#C81E33]" />
                      <span>เคสที่ผิดบ่อย 5 อันดับแรก</span>
                    </h3>
                    <div className="space-y-2.5 my-2">
                      {stats.topMissed.map((item, idx) => (
                        <div key={item.id} className="text-xs">
                          <div className="flex justify-between font-bold mb-0.5">
                            <span className="text-amber-100 truncate max-w-[170px]">{idx + 1}. {item.id}: {item.name}</span>
                            <span className="text-rose-400 font-mono">{item.missedCount} ครั้ง</span>
                          </div>
                          <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-red-950">
                            <div 
                              className="h-full bg-[#C81E33] rounded-full" 
                              style={{ width: `${(item.missedCount / 30) * 100}%` }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] text-rose-300/70 pt-2 border-t border-white/5">
                    วิเคราะห์หาจุดที่นักศึกษาต้องการเสริมความรู้เพิ่มเติม
                  </div>
                </div>

                {/* Chart 3: สิบคนที่เหรียญสูงสุด (Top 10 Leaderboard) */}
                <div className="bg-black/35 backdrop-blur-md p-5 rounded-2xl border border-amber-500/30 shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black font-game text-[#E6A100] mb-3 flex items-center space-x-2">
                      <Coins className="w-4 h-4 text-[#E6A100]" />
                      <span>10 คนที่เหรียญสูงสุด</span>
                    </h3>
                    <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
                      {stats.topStudents.map((s, idx) => (
                        <div key={s.studentId} className="flex justify-between items-center text-xs p-1.5 rounded-lg bg-black/25 border border-amber-800/30">
                          <div className="flex items-center space-x-1.5 truncate">
                            <span className="font-mono font-black text-amber-400 w-4">{idx + 1}.</span>
                            <span className="text-white truncate max-w-[120px]">{s.displayName}</span>
                          </div>
                          <span className="font-mono font-bold text-[#E6A100] shrink-0">{s.coins} เหรียญ</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] text-amber-300/70 pt-2 border-t border-white/5">
                    นักศึกษาที่มีผลการประลองและภารกิจสูงสุด
                  </div>
                </div>
              </div>

              {/* Bottom Notice & CSV Export Button */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 rounded-2xl bg-black/40 border border-amber-600/30">
                <span className="text-xs text-amber-300/80 italic text-center sm:text-left">
                  ข้อมูลสถิติประมวลผลจากข้อมูลในเครื่องนี้ (Local Storage) - อัปเดตล่าสุดตามการเล่นจริง
                </span>
                <button
                  onClick={handleExportCsv}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black text-xs font-game transition-all active:scale-95 shadow-lg cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>ส่งออกสถิติ CSV</span>
                </button>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB 2: คลังการ์ด (CARD LIBRARY)
             ==================================================== */}
          {activeTab === "library" && (
            <div className="space-y-4 max-w-6xl mx-auto">
              {/* Header: Subtabs + Search + Add Button */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-black/35 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-amber-500/30">
                {/* 4 Subtabs */}
                <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  {[
                    { type: "RP", label: "ใบฟ้า (RP)", color: "bg-[#2F6FED]" },
                    { type: "MECH", label: "ใบเหลือง (MECH)", color: "bg-[#E6A100]" },
                    { type: "CASE", label: "ใบแดง (CASE)", color: "bg-[#C81E33]" },
                    { type: "CLUE", label: "ใบเขียว (CLUE)", color: "bg-[#2EAD4B]" },
                  ].map((sub) => (
                    <button
                      key={sub.type}
                      onClick={() => {
                        sounds.playSelect();
                        setLibrarySubTab(sub.type as CardType);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-game font-bold text-xs transition-all cursor-pointer shrink-0 ${
                        librarySubTab === sub.type
                          ? `${sub.color} text-white shadow-md scale-102`
                          : "bg-black/40 text-amber-200/70 hover:text-white"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>

                {/* Search & Add Action */}
                <div className="flex items-center space-x-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-60">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/60" />
                    <input
                      type="text"
                      value={cardSearchQuery}
                      onChange={(e) => setCardSearchQuery(e.target.value)}
                      placeholder="ค้นหารหัส หรือชื่อการ์ด..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/50 border border-amber-700/40 text-xs text-white placeholder-amber-400/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    onClick={() => {
                      sounds.playSelect();
                      if (librarySubTab === "RP") setShowAddRpModal(true);
                      else if (librarySubTab === "MECH") setShowAddMechModal(true);
                      else if (librarySubTab === "CASE") setShowAddCaseModal(true);
                      else setShowAddClueModal(true);
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-black text-xs font-game shadow-md active:scale-95 cursor-pointer shrink-0"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>เพิ่มการ์ด</span>
                  </button>
                </div>
              </div>

              {/* Table Container with Horizontal Scroll Protection (game-ui-ux) */}
              <div className="bg-black/35 backdrop-blur-md rounded-2xl border border-amber-500/30 overflow-hidden shadow-xl">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-black/60 border-b border-amber-900/60 text-amber-300 font-game font-bold">
                        <th className="p-3 w-20">รหัส</th>
                        <th className="p-3">ชื่อการ์ด (อังกฤษ / ไทย)</th>
                        <th className="p-3">รายละเอียดสำคัญ</th>
                        <th className="p-3 w-32 text-center">สถานะใช้งาน</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {filteredLibraryCards.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-amber-300/60 italic">
                            ไม่พบข้อมูลการ์ดที่ค้นหา
                          </td>
                        </tr>
                      ) : (
                        filteredLibraryCards.map((card: any) => {
                          const isDisabled = card.disabled === true;
                          return (
                            <tr key={card.id} className={`hover:bg-white/5 transition-colors ${isDisabled ? "opacity-50" : ""}`}>
                              <td className="p-3">
                                <div className="flex items-center space-x-2">
                                  <span className={`font-mono font-black px-2 py-0.5 rounded text-[11px] ${
                                    librarySubTab === "RP" ? "bg-blue-950 text-blue-300 border border-blue-600/40" :
                                    librarySubTab === "MECH" ? "bg-amber-950 text-amber-300 border border-amber-600/40" :
                                    librarySubTab === "CASE" ? "bg-red-950 text-rose-300 border border-red-600/40" :
                                    "bg-emerald-950 text-emerald-300 border border-emerald-600/40"
                                  }`}>
                                    {card.id}
                                  </span>
                                  {card.artUrl && (
                                    <img 
                                      src={card.artUrl} 
                                      alt="preview" 
                                      className="w-6 h-6 object-cover rounded border border-amber-400/40 shadow-xs" 
                                      title="การ์ดนี้มีรูปภาพกำหนดเอง"
                                    />
                                  )}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-white text-xs">{card.titleEn || card.titleTh}</div>
                                <div className="text-[11px] text-amber-300/80">{card.titleTh}</div>
                              </td>
                              <td className="p-3 text-[11px] text-slate-300">
                                {librarySubTab === "RP" && (
                                  <div>
                                    <span className="font-nuclide font-black text-amber-400 mr-2">{card.nuclide}</span>
                                    <span className="bg-blue-900/40 text-blue-200 px-1.5 py-0.2 rounded text-[10px] mr-2">{card.modality}</span>
                                    <span className="text-slate-400">Target: {card.target}</span>
                                  </div>
                                )}
                                {librarySubTab === "MECH" && (
                                  <div>
                                    {card.body && card.body.slice(0, 2).join(" • ")}
                                  </div>
                                )}
                                {librarySubTab === "CASE" && (
                                  <div>
                                    <span className={`px-1.5 py-0.2 rounded text-[10px] mr-2 font-bold ${
                                      card.difficulty === "CLINICAL" ? "bg-red-900/60 text-red-200" : "bg-emerald-900/60 text-emerald-200"
                                    }`}>
                                      {card.difficulty} ({card.points} คะแนน)
                                    </span>
                                    <span className="text-slate-400">อวัยวะ: {card.organHint}</span>
                                    {(!card.clueId || card.acceptedRpIds?.length === 0) && (
                                      <span className="ml-2 text-rose-400 font-bold">«คู่ไม่ครบ»</span>
                                    )}
                                  </div>
                                )}
                                {librarySubTab === "CLUE" && (
                                  <div>
                                    <span className="text-amber-200 font-bold">{card.subtitle}</span>
                                    <div className="text-slate-400 text-[10px] truncate max-w-md">{card.reveals}</div>
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center space-x-1.5">
                                  <button
                                    onClick={() => handleOpenEditCard(librarySubTab, card)}
                                    className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-500/40 transition-all cursor-pointer flex items-center space-x-1 shadow-xs"
                                    title="แก้ไขข้อมูลและการ์ดภาพ"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                    <span>แก้ไข</span>
                                  </button>
                                  <button
                                    onClick={() => handleToggleCard(librarySubTab, card.id)}
                                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                                      isDisabled
                                        ? "bg-slate-800 text-slate-400 border border-slate-600/40"
                                        : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-xs"
                                    }`}
                                    title={isDisabled ? "คลิกเพื่อเปิดใช้งาน" : "คลิกเพื่อปิดใช้งาน (ห้ามแจก)"}
                                  >
                                    {isDisabled ? (
                                      <>
                                        <ToggleLeft className="w-3.5 h-3.5" />
                                        <span>ปิด</span>
                                      </>
                                    ) : (
                                      <>
                                        <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>เปิด</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB 3: จับคู่เฉลย (ANSWER PAIRING)
             ==================================================== */}
          {activeTab === "pairing" && (
            <div className="max-w-6xl mx-auto space-y-4">
              {pairingSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between">
                  <span>{pairingSuccessMessage}</span>
                  <button onClick={() => setPairingSuccessMessage(null)} className="cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Left Column: รายการใบแดง (Case List) */}
                <div className="lg:col-span-4 bg-black/35 backdrop-blur-md rounded-2xl border border-amber-500/30 p-3 sm:p-4 shadow-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black font-game text-amber-200 uppercase tracking-wider">
                      รายการโจทย์เคส (CASE DECK)
                    </h3>
                    <span className="text-[10px] text-amber-300/70">{caseCards.length} เคส</span>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-400/50" />
                    <input
                      type="text"
                      value={pairingCaseSearch}
                      onChange={(e) => setPairingCaseSearch(e.target.value)}
                      placeholder="ค้นหาเคส..."
                      className="w-full pl-8 pr-2 py-1 rounded-xl bg-black/50 border border-amber-800/40 text-xs text-white focus:outline-none"
                    />
                  </div>

                  {/* Scrollable Case Items */}
                  <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                    {caseCards
                      .filter(c => 
                        !pairingCaseSearch.trim() || 
                        c.id.toLowerCase().includes(pairingCaseSearch.toLowerCase()) || 
                        c.titleTh.toLowerCase().includes(pairingCaseSearch.toLowerCase())
                      )
                      .map((c) => {
                        const isSelected = selectedCaseForPairing?.id === c.id;
                        const isIncomplete = c.acceptedRpIds.length === 0 || c.acceptedMechIds.length === 0 || !c.clueId;

                        return (
                          <button
                            key={c.id}
                            onClick={() => selectCaseForPairing(c)}
                            className={`w-full p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-gradient-to-r from-red-950 via-red-900 to-amber-950 border-amber-400 shadow-md scale-101"
                                : "bg-black/25 hover:bg-black/45 border-white/5 text-slate-300"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-mono font-black text-xs text-rose-300 bg-red-950 px-1.5 py-0.2 rounded border border-red-700/50">
                                {c.id}
                              </span>
                              {isIncomplete && (
                                <span className="bg-[#C81E33] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs animate-pulse">
                                  «คู่ไม่ครบ»
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-bold text-white truncate">{c.titleTh}</div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">
                              อวัยวะ: {c.organHint || "—"} • {c.difficulty}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Center / Right Column: 3 ช่องการจับคู่ (3 Zones) */}
                <div className="lg:col-span-8 bg-black/35 backdrop-blur-md rounded-2xl border border-amber-500/30 p-4 sm:p-6 shadow-xl space-y-5">
                  {selectedCaseForPairing ? (
                    <>
                      {/* Case Header Info */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-white/10">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-black text-base text-rose-400 bg-red-950 px-2 py-0.5 rounded border border-red-600/50">
                              {selectedCaseForPairing.id}
                            </span>
                            <h2 className="text-base sm:text-lg font-black text-white font-game">
                              {selectedCaseForPairing.titleTh}
                            </h2>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">
                            {selectedCaseForPairing.promptTh}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            selectedCaseForPairing.difficulty === "CLINICAL" ? "bg-red-900/60 text-red-200" : "bg-emerald-900/60 text-emerald-200"
                          }`}>
                            {selectedCaseForPairing.difficulty} ({selectedCaseForPairing.points} แต้ม)
                          </span>
                        </div>
                      </div>

                      {/* Zone 1: สารเภสัชรังสีที่ถูก (Multi-select) */}
                      <div className="p-3.5 rounded-xl bg-black/30 border border-blue-500/30 space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                            1. สารเภสัชรังสีที่ถูกต้อง (RADIOPHARMACEUTICALS - เลือกได้หลายใบ)
                          </span>
                          <span className="text-[10px] text-blue-200/70">เลือกแล้ว {tempAcceptedRpIds.length} ใบ</span>
                        </div>
                        {/* Selected RP Badges */}
                        <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-lg bg-black/40 border border-blue-900/40 items-center">
                          {tempAcceptedRpIds.length === 0 ? (
                            <span className="text-xs text-rose-400 italic">⚠️ ยังไม่ได้เลือกสารรังสี</span>
                          ) : (
                            tempAcceptedRpIds.map((rId) => {
                              const rp = rpCards.find(r => r.id === rId);
                              return (
                                <span key={rId} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-900/80 text-white text-xs border border-blue-400/50 shadow-xs">
                                  <span className="font-mono font-bold text-blue-300">{rId}</span>
                                  <span className="font-nuclide">{rp?.nuclide || ""}</span>
                                  <button
                                    onClick={() => setTempAcceptedRpIds(prev => prev.filter(x => x !== rId))}
                                    className="hover:text-rose-300 ml-1 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </span>
                              );
                            })
                          )}
                        </div>
                        {/* Selector Dropdown / Toggles */}
                        <div className="flex flex-wrap gap-1 max-h-[85px] overflow-y-auto p-1">
                          {rpCards.map((rp) => {
                            const isChosen = tempAcceptedRpIds.includes(rp.id);
                            return (
                              <button
                                key={rp.id}
                                onClick={() => {
                                  if (isChosen) setTempAcceptedRpIds(prev => prev.filter(x => x !== rp.id));
                                  else setTempAcceptedRpIds(prev => [...prev, rp.id]);
                                }}
                                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                                  isChosen
                                    ? "bg-blue-600 text-white font-bold"
                                    : "bg-black/40 hover:bg-blue-950 text-blue-300/70 border border-blue-900/30"
                                }`}
                              >
                                + {rp.id} ({rp.nuclide})
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Zone 2: กลไกที่ถูกต้อง (Multi-select) */}
                      <div className="p-3.5 rounded-xl bg-black/30 border border-amber-500/30 space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                            2. กลไกการสะสมที่ถูกต้อง (MECHANISMS - เลือกได้หลายใบ)
                          </span>
                          <span className="text-[10px] text-amber-200/70">เลือกแล้ว {tempAcceptedMechIds.length} อย่าง</span>
                        </div>
                        {/* Selected Mech Badges */}
                        <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-lg bg-black/40 border border-amber-900/40 items-center">
                          {tempAcceptedMechIds.length === 0 ? (
                            <span className="text-xs text-rose-400 italic">⚠️ ยังไม่ได้เลือกกลไก</span>
                          ) : (
                            tempAcceptedMechIds.map((mId) => {
                              const mech = mechCards.find(m => m.id === mId);
                              return (
                                <span key={mId} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-900/80 text-white text-xs border border-amber-400/50 shadow-xs">
                                  <span className="font-mono font-bold text-amber-300">{mId}</span>
                                  <span>{mech?.titleEn || ""}</span>
                                  <button
                                    onClick={() => setTempAcceptedMechIds(prev => prev.filter(x => x !== mId))}
                                    className="hover:text-rose-300 ml-1 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </span>
                              );
                            })
                          )}
                        </div>
                        {/* Selector Dropdown / Toggles */}
                        <div className="flex flex-wrap gap-1 max-h-[85px] overflow-y-auto p-1">
                          {mechCards.map((mech) => {
                            const isChosen = tempAcceptedMechIds.includes(mech.id);
                            return (
                              <button
                                key={mech.id}
                                onClick={() => {
                                  if (isChosen) setTempAcceptedMechIds(prev => prev.filter(x => x !== mech.id));
                                  else setTempAcceptedMechIds(prev => [...prev, mech.id]);
                                }}
                                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                                  isChosen
                                    ? "bg-amber-600 text-white font-bold"
                                    : "bg-black/40 hover:bg-amber-950 text-amber-300/70 border border-amber-900/30"
                                }`}
                              >
                                + {mech.id} ({mech.titleEn})
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Zone 3: ใบเขียว (Single-select) */}
                      <div className="p-3.5 rounded-xl bg-black/30 border border-emerald-500/30 space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                            3. ใบเขียวคำใบ้ประจำเคส (CLUE - เลือกได้เพียง 1 ใบ)
                          </span>
                          <span className="text-[10px] text-emerald-200/70">
                            {tempClueId ? `เลือก ${tempClueId} แล้ว` : "ยังไม่ได้เลือก"}
                          </span>
                        </div>

                        <select
                          value={tempClueId}
                          onChange={(e) => setTempClueId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/50 border border-emerald-600/50 text-xs text-white focus:outline-none focus:border-emerald-400"
                        >
                          <option value="">-- เลือกคำใบ้สำหรับเคสนี้ --</option>
                          {clueCards.map((clue) => (
                            <option key={clue.id} value={clue.id}>
                              {clue.id}: {clue.titleTh} ({clue.subtitle || clue.illustration})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Save Action Bar */}
                      <div className="flex justify-between items-center pt-3 border-t border-white/10">
                        <span className="text-xs text-slate-300">
                          * การบันทึกจะอัปเดตกองที่เกมใช้อยู่ทันที (รอบที่เล่นค้างจะไม่เปลี่ยนกลางมือ)
                        </span>
                        <button
                          onClick={handleSavePairing}
                          disabled={tempAcceptedRpIds.length < 1 || tempAcceptedMechIds.length < 1 || !tempClueId}
                          className={`px-6 py-2.5 rounded-xl font-game font-black text-xs tracking-wider transition-all shadow-lg cursor-pointer ${
                            tempAcceptedRpIds.length >= 1 && tempAcceptedMechIds.length >= 1 && tempClueId
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 hover:from-emerald-400 hover:to-emerald-500 active:scale-95 shadow-[0_4px_12px_rgba(46,173,75,0.4)]"
                              : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                          }`}
                        >
                          บันทึกการจับคู่เฉลย
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-12 text-center text-slate-400 italic">
                      กรุณาเลือกเคสจากแถบด้านซ้ายเพื่อตั้งค่าเฉลย
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

                    {/* ====================================================
              TAB 4: นักเรียน (STUDENTS)
             ==================================================== */}
          {activeTab === "students" && (
            <div className="space-y-4 max-w-6xl mx-auto">
              
              {/* Leaderboard Section */}
              <div className="bg-black/35 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 shadow-xl">
                <h3 className="text-base font-black font-game text-white mb-3">Leaderboard ลำดับคะแนนเหรียญสูงสุด</h3>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-black/60 border-b border-amber-900/60 text-amber-300 font-game font-bold">
                        <th className="p-3 w-16 text-center">อันดับ</th>
                        <th className="p-3">ชื่อ</th>
                        <th className="p-3 w-32">รหัสนักศึกษา</th>
                        <th className="p-3 w-28 text-center">เหรียญ</th>
                        <th className="p-3 w-28 text-center">ข้อถูก</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {(() => {
                        const sorted = [...students].sort((a,b) => b.coins - a.coins);
                        if (sorted.length === 0) {
                          return <tr><td colSpan={5} className="p-8 text-center text-amber-300/60 italic">ยังไม่มีบัญชีในเบราว์เซอร์นี้</td></tr>;
                        }
                        return sorted.map((acc, idx) => {
                          let rankStyle = "text-slate-400";
                          let rankBg = "";
                          if (idx === 0) { rankStyle = "text-amber-900 font-black"; rankBg = "bg-yellow-400 shadow-[0_0_10px_#facc15]"; }
                          else if (idx === 1) { rankStyle = "text-slate-900 font-black"; rankBg = "bg-slate-300 shadow-[0_0_10px_#cbd5e1]"; }
                          else if (idx === 2) { rankStyle = "text-orange-950 font-black"; rankBg = "bg-orange-400 shadow-[0_0_10px_#fb923c]"; }

                          return (
                            <tr key={`lb-${acc.studentId}`} className="hover:bg-amber-500/10 transition-colors">
                              <td className="p-3 text-center">
                                <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${rankBg} ${rankStyle}`}>
                                  {idx + 1}
                                </div>
                              </td>
                              <td className="p-3 font-bold text-white">{acc.displayName}</td>
                              <td className="p-3 font-mono text-amber-200">{acc.studentId}</td>
                              <td className="p-3 text-center font-mono font-bold text-[#E6A100]">
                                <div className="flex items-center justify-center gap-1">
                                  <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full border border-yellow-600 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center">
                                    <span className="text-[8px] font-black text-yellow-900 leading-none">N</span>
                                  </div>
                                  {acc.coins}
                                </div>
                              </td>
                              <td className="p-3 text-center font-mono font-bold text-[#2EAD4B]">{acc.correctCount || 0}</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Student Table Controls */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 bg-black/35 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <h3 className="text-base font-black font-game text-white">รายชื่อนักศึกษาและบัญชีผู้เล่น</h3>
                    <p className="text-xs text-amber-300/80">คลิกที่แถวเพื่อปรับเหรียญ, รีเซ็ตยอด, หรือระงับบัญชี</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={handleManualRefresh}
                      className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/50 rounded-lg text-amber-300 font-bold text-xs transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      รีเฟรชรายชื่อ
                    </button>

                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      isSyncConnected
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isSyncConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                      {isSyncConnected ? "ซิงค์ข้ามอุปกรณ์ออนไลน์" : "กำลังเชื่อมต่อซิงค์..."}
                    </div>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setSyncJsonInput(JSON.stringify(getNaAccounts(), null, 2));
                        setShowSyncJsonModal(true);
                        setSyncJsonStatus("");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 rounded-lg text-blue-300 font-bold text-xs transition-colors"
                      title="คัดลอกหรือวาง JSON เพื่อย้ายบัญชีข้ามเครื่องทันที"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      แชร์ / สำรอง JSON
                    </button>
                  </div>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/60" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="ค้นหารหัส หรือชื่อนักศึกษา..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/50 border border-amber-700/40 text-xs text-white placeholder-amber-400/40 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Table Container with Horizontal Scroll Protection (game-ui-ux) */}
              <div className="bg-black/35 backdrop-blur-md rounded-2xl border border-amber-500/30 overflow-hidden shadow-xl">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-black/60 border-b border-amber-900/60 text-amber-300 font-game font-bold">
                        <th className="p-3 w-32">รหัสนักศึกษา</th>
                        <th className="p-3">ชื่อ</th>
                        <th className="p-3 w-32 text-center">รหัสผ่าน</th>
                        <th className="p-3 w-28 text-center">เหรียญ</th>
                        <th className="p-3 w-28 text-center">ข้อถูก</th>
                        <th className="p-3 w-44">เล่นล่าสุด</th>
                        <th className="p-3 w-28 text-center">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-amber-300/60 italic">
                            ยังไม่มีบัญชีในเบราว์เซอร์นี้
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((acc) => {
                          const isAdmin = acc.studentId.toLowerCase() === "admin";
                          return (
                            <tr
                              key={acc.studentId}
                              onClick={() => setSelectedStudentForCoins(acc)}
                              className="hover:bg-amber-500/10 cursor-pointer transition-colors"
                            >
                              <td className="p-3 font-mono font-bold text-amber-200">
                                {acc.studentId}
                              </td>
                              <td className="p-3 font-bold text-white">
                                {acc.displayName}
                                {isAdmin && (
                                  <span className="ml-2 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/40">
                                    Admin
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex justify-center items-center space-x-1.5">
                                  {revealedPasswords[acc.studentId] ? (
                                    <span className="font-mono text-amber-200 text-xs bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 select-text">
                                      {revealedPasswords[acc.studentId]}
                                    </span>
                                  ) : (
                                    <span className="font-mono text-slate-500 text-xs">
                                      ••••••
                                    </span>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (revealedPasswords[acc.studentId]) {
                                        setRevealedPasswords(prev => {
                                          const next = { ...prev };
                                          delete next[acc.studentId];
                                          return next;
                                        });
                                      } else {
                                        setAdminPasswordInput("");
                                        setPasswordRevealError("");
                                        setShowPasswordModal({ isOpen: true, studentId: acc.studentId, studentName: acc.displayName });
                                      }
                                    }}
                                    className="px-2 py-1 bg-amber-900/40 hover:bg-amber-500/30 border border-amber-500/40 rounded text-[10px] font-bold text-amber-300 transition-colors"
                                  >
                                    {revealedPasswords[acc.studentId] ? "ซ่อน" : "ดูรหัส"}
                                  </button>
                                </div>
                              </td>
                              <td className="p-3 text-center font-mono font-bold text-[#E6A100]">
                                <div className="flex items-center justify-center gap-1">
                                  <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full border border-yellow-600 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center">
                                    <span className="text-[8px] font-black text-yellow-900 leading-none">N</span>
                                  </div>
                                  {acc.coins}
                                </div>
                              </td>
                              <td className="p-3 text-center font-mono font-bold text-[#2EAD4B]">
                                {acc.correctCount || 0}
                              </td>
                              <td className="p-3 text-slate-400 text-[11px]">
                                {acc.lastPlayedAt ? new Date(acc.lastPlayedAt).toLocaleString("th-TH") : "ยังไม่ได้เล่น"}
                              </td>
                              <td className="p-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  acc.disabled
                                    ? "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                                    : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                                }`}>
                                  {acc.disabled ? "ระงับการใช้งาน" : "ปกติ"}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Footer loading info */}
                <div className="p-3 border-t border-amber-900/60 bg-black/40 flex justify-between items-center">
                  <div className="text-xs text-amber-300/60">
                    โหลดเมื่อ: {studentsLoadedAt ? studentsLoadedAt.toLocaleTimeString("th-TH") : "ยังไม่ได้โหลด"}
                  </div>
                  <div className="text-xs text-amber-300/60 font-bold">
                    จำนวนบัญชีทั้งหมด: {students.length} บัญชี
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* ----------------------------------------------------
          MODAL: Reveal Student Password
         ---------------------------------------------------- */}
      <AnimatePresence>
        {showPasswordModal?.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          >
            <div className="w-full max-w-sm bg-[#0B3B36] border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-900/60 border border-amber-400 mx-auto flex items-center justify-center text-amber-300">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-base font-black font-game text-white">
                ยืนยันรหัสแอดมิน
              </h3>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                กรุณากรอกรหัสแอดมินอีกครั้งเพื่อดูรหัสผ่านของ<br/>
                <span className="font-bold text-amber-400">{showPasswordModal.studentName} ({showPasswordModal.studentId})</span>
              </p>
              
              <input
                type="password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="รหัสผ่านแอดมิน"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRevealPassword();
                  }
                }}
                className="w-full px-4 py-2 bg-black/50 border border-amber-500/50 rounded-xl text-white text-center tracking-widest focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              
              {passwordRevealError && (
                <div className="text-xs text-rose-400 font-bold bg-rose-950/50 py-1 px-2 rounded-lg border border-rose-500/30">
                  {passwordRevealError}
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => setShowPasswordModal(null)}
                  className="flex-1 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleRevealPassword}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xs cursor-pointer shadow-md transition-colors"
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------
          MODAL: Confirmation Dialog (e.g. Lung Case + Thyroid Clue)
         ---------------------------------------------------- */}
      <AnimatePresence>
        {pairingWarningModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          >
            <div className="w-full max-w-md bg-[#0B3B36] border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-900/60 border border-amber-400 mx-auto flex items-center justify-center text-amber-300">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-base font-black font-game text-white">
                คำเตือนการจับคู่ไม่ตรงอวัยวะ
              </h3>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {pairingWarningModal.message}
              </p>
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => setPairingWarningModal({ isOpen: false, message: "", onConfirm: () => {} })}
                  className="flex-1 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    const cb = pairingWarningModal.onConfirm;
                    setPairingWarningModal({ isOpen: false, message: "", onConfirm: () => {} });
                    cb();
                  }}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xs cursor-pointer shadow-md"
                >
                  ยืนยันการบันทึก
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------
          MODAL: Add RP Card (ใบฟ้า)
         ---------------------------------------------------- */}
      <AnimatePresence>
        {showAddRpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-[#0B3B36] border-2 border-blue-500/60 rounded-3xl p-6 shadow-2xl space-y-4 my-auto">
              <div className="flex justify-between items-center border-b border-blue-500/30 pb-3">
                <h3 className="text-base font-black font-game text-white flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#2F6FED]" />
                  <span>เพิ่มการ์ดสารเภสัชรังสี (RP CARD - ใบฟ้า)</span>
                </h3>
                <button onClick={() => setShowAddRpModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {rpFormError && (
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs">
                  {rpFormError}
                </div>
              )}

              <div className="space-y-3 text-xs">
                {/* ID & Modality */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-blue-200 font-bold mb-1">รหัสการ์ด (ห้ามซ้ำ)*</label>
                    <input
                      type="text"
                      value={newRp.id}
                      onChange={(e) => setNewRp({ ...newRp, id: e.target.value.toUpperCase() })}
                      placeholder="R-12"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-blue-600/40 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-200 font-bold mb-1">ประเภทเครื่องตรวจ (Modality)*</label>
                    <select
                      value={newRp.modality}
                      onChange={(e) => setNewRp({ ...newRp, modality: e.target.value as any })}
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-blue-600/40 text-white"
                    >
                      <option value="SPECT">SPECT</option>
                      <option value="PET">PET</option>
                    </select>
                  </div>
                </div>

                {/* Nuclide with Superscript Buttons */}
                <div>
                  <label className="block text-blue-200 font-bold mb-1">ชื่อไอโซโทป / สารรังสี (ใส่ตัวยกได้)*</label>
                  <input
                    type="text"
                    value={newRp.nuclide}
                    onChange={(e) => setNewRp({ ...newRp, nuclide: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-blue-600/40 text-white font-nuclide font-bold"
                  />
                  <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
                    <span className="text-slate-400 self-center">แทรกตัวยก:</span>
                    {["⁹⁹ᵐTc", "¹⁸F", "¹²³I", "¹³¹I", "⁶⁸Ga", "¹¹¹In", "²⁰¹Tl"].map((sup) => (
                      <button
                        key={sup}
                        type="button"
                        onClick={() => insertSuperscript(sup)}
                        className="px-1.5 py-0.5 rounded bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-500/40 font-mono cursor-pointer"
                      >
                        {sup}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Names */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-blue-200 font-bold mb-1">ชื่อภาษาอังกฤษ (ชื่อเต็ม)*</label>
                    <input
                      type="text"
                      value={newRp.titleEn}
                      onChange={(e) => setNewRp({ ...newRp, titleEn: e.target.value })}
                      placeholder="Technetium-99m Mebrofenin"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-blue-600/40 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-200 font-bold mb-1">ชื่อภาษาไทย*</label>
                    <input
                      type="text"
                      value={newRp.titleTh}
                      onChange={(e) => setNewRp({ ...newRp, titleTh: e.target.value })}
                      placeholder="สารตรวจการทำงานของตับและท่อน้ำดี"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-blue-600/40 text-white"
                    />
                  </div>
                </div>

                {/* 4 Rows: Target, Transporter, Mechanism, Application */}
                <div className="p-3 rounded-xl bg-black/30 border border-blue-500/20 space-y-2">
                  <span className="text-[11px] font-bold text-amber-300 block mb-1">สี่แถวข้อมูลเฉพาะ (Specifications)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 text-[10px]">Target (เป้าหมาย)</label>
                      <input
                        type="text"
                        value={newRp.target}
                        onChange={(e) => setNewRp({ ...newRp, target: e.target.value })}
                        placeholder="Hepatocytes"
                        className="w-full px-2.5 py-1 rounded bg-black/50 border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-[10px]">Transporter (ตัวลำเลียง)</label>
                      <input
                        type="text"
                        value={newRp.transporter}
                        onChange={(e) => setNewRp({ ...newRp, transporter: e.target.value })}
                        placeholder="OATP1B1"
                        className="w-full px-2.5 py-1 rounded bg-black/50 border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-[10px]">Mechanism (กลไกหลัก)</label>
                      <select
                        value={newRp.mechanismId}
                        onChange={(e) => setNewRp({ ...newRp, mechanismId: e.target.value })}
                        className="w-full px-2.5 py-1 rounded bg-black/50 border border-white/10 text-white"
                      >
                        {mechCards.map(m => (
                          <option key={m.id} value={m.id}>{m.id}: {m.titleEn}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 text-[10px]">Application (การประยุกต์ใช้)</label>
                      <input
                        type="text"
                        value={newRp.application}
                        onChange={(e) => setNewRp({ ...newRp, application: e.target.value })}
                        placeholder="Hepatobiliary imaging"
                        className="w-full px-2.5 py-1 rounded bg-black/50 border border-white/10 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRpModal(false)}
                  className="flex-1 py-2 rounded-xl bg-black/40 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSaveRp}
                  className="flex-1 py-2 rounded-xl bg-[#2F6FED] hover:bg-blue-600 text-white font-black text-xs cursor-pointer shadow-md"
                >
                  บันทึกลงกองเล่น
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------
          MODAL: Add MECH Card (ใบเหลือง)
         ---------------------------------------------------- */}
      <AnimatePresence>
        {showAddMechModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
          >
            <div className="w-full max-w-md bg-[#0B3B36] border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl space-y-4 my-auto">
              <div className="flex justify-between items-center border-b border-amber-500/30 pb-3">
                <h3 className="text-base font-black font-game text-white flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#E6A100]" />
                  <span>เพิ่มกลไกการสะสม (MECH - ใบเหลือง)</span>
                </h3>
                <button onClick={() => setShowAddMechModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {mechFormError && (
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs">
                  {mechFormError}
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-amber-200 font-bold mb-1">รหัสกลไก (ห้ามซ้ำ)*</label>
                  <input
                    type="text"
                    value={newMech.id}
                    onChange={(e) => setNewMech({ ...newMech, id: e.target.value.toUpperCase() })}
                    placeholder="M-13"
                    className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-amber-600/40 text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-amber-200 font-bold mb-1">ชื่อภาษาอังกฤษ*</label>
                    <input
                      type="text"
                      value={newMech.titleEn}
                      onChange={(e) => setNewMech({ ...newMech, titleEn: e.target.value })}
                      placeholder="Active Transport"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-amber-600/40 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-200 font-bold mb-1">ชื่อภาษาไทย*</label>
                    <input
                      type="text"
                      value={newMech.titleTh}
                      onChange={(e) => setNewMech({ ...newMech, titleTh: e.target.value })}
                      placeholder="การลำเลียงแบบใช้พลังงาน"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-amber-600/40 text-white"
                    />
                  </div>
                </div>

                {/* 4 Short Rows: ตำแหน่ง, ขนาด, ผล, ใช้กับ */}
                <div className="p-3 rounded-xl bg-black/30 border border-amber-500/20 space-y-2">
                  <span className="text-[11px] font-bold text-amber-300 block mb-1">
                    สี่แถวสั้น (ตำแหน่ง, ขนาด, ผล, ใช้กับ - สั้นกระชับ)
                  </span>
                  <div>
                    <label className="block text-slate-300 text-[10px]">ตำแหน่ง (Location)</label>
                    <input
                      type="text"
                      value={newMech.location}
                      onChange={(e) => setNewMech({ ...newMech, location: e.target.value })}
                      placeholder="เยื่อหุ้มเซลล์ (Cell membrane)"
                      className="w-full px-2.5 py-1 rounded bg-black/50 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-[10px]">ขนาด (Scale/Size)</label>
                    <input
                      type="text"
                      value={newMech.scale}
                      onChange={(e) => setNewMech({ ...newMech, scale: e.target.value })}
                      placeholder="ระดับไอออนและโมเลกุลขนาดเล็ก"
                      className="w-full px-2.5 py-1 rounded bg-black/50 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-[10px]">ผล (Effect/Result)</label>
                    <input
                      type="text"
                      value={newMech.result}
                      onChange={(e) => setNewMech({ ...newMech, result: e.target.value })}
                      placeholder="สะสมสารรังสีต้านความเข้มข้น"
                      className="w-full px-2.5 py-1 rounded bg-black/50 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-[10px]">ใช้กับ (Clinical Usage)</label>
                    <input
                      type="text"
                      value={newMech.usage}
                      onChange={(e) => setNewMech({ ...newMech, usage: e.target.value })}
                      placeholder="ต่อมไทรอยด์, กล้ามเนื้อหัวใจ"
                      className="w-full px-2.5 py-1 rounded bg-black/50 border border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMechModal(false)}
                  className="flex-1 py-2 rounded-xl bg-black/40 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSaveMech}
                  className="flex-1 py-2 rounded-xl bg-[#E6A100] hover:bg-amber-500 text-amber-950 font-black text-xs cursor-pointer shadow-md"
                >
                  บันทึกลงกองเล่น
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------
          MODAL: Add CASE Card (ใบแดง)
         ---------------------------------------------------- */}
      <AnimatePresence>
        {showAddCaseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-[#0B3B36] border-2 border-red-500/60 rounded-3xl p-6 shadow-2xl space-y-4 my-auto">
              <div className="flex justify-between items-center border-b border-red-500/30 pb-3">
                <h3 className="text-base font-black font-game text-white flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#C81E33]" />
                  <span>เพิ่มโจทย์เคสทางคลินิก (CASE - ใบแดง)</span>
                </h3>
                <button onClick={() => setShowAddCaseModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {caseFormError && (
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs">
                  {caseFormError}
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-rose-200 font-bold mb-1">รหัสการ์ด (ห้ามซ้ำ)*</label>
                    <input
                      type="text"
                      value={newCase.id}
                      onChange={(e) => setNewCase({ ...newCase, id: e.target.value.toUpperCase() })}
                      placeholder="C-11"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-red-600/40 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-rose-200 font-bold mb-1">ระดับความยาก*</label>
                    <select
                      value={newCase.difficulty}
                      onChange={(e) => {
                        const diff = e.target.value as "BASIC" | "CLINICAL";
                        setNewCase({ ...newCase, difficulty: diff, points: diff === "BASIC" ? 2 : 4 });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-red-600/40 text-white"
                    >
                      <option value="BASIC">BASIC</option>
                      <option value="CLINICAL">CLINICAL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-rose-200 font-bold mb-1">คะแนน (ล็อก 2 หรือ 4)*</label>
                    <div className="flex space-x-1.5 mt-1">
                      <button
                        type="button"
                        onClick={() => setNewCase({ ...newCase, points: 2 })}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          newCase.points === 2 ? "bg-amber-400 text-amber-950 font-black shadow-xs" : "bg-black/40 text-slate-400"
                        }`}
                      >
                        2 คะแนน
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewCase({ ...newCase, points: 4 })}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          newCase.points === 4 ? "bg-amber-400 text-amber-950 font-black shadow-xs" : "bg-black/40 text-slate-400"
                        }`}
                      >
                        4 คะแนน
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-rose-200 font-bold mb-1">ชื่อโจทย์ภาษาไทย*</label>
                    <input
                      type="text"
                      value={newCase.titleTh}
                      onChange={(e) => setNewCase({ ...newCase, titleTh: e.target.value })}
                      placeholder="Bone Scan ประเมินกระดูกทั่วตัว"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-red-600/40 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-rose-200 font-bold mb-1">อวัยวะ (Organ Hint)*</label>
                    <select
                      value={newCase.organHint}
                      onChange={(e) => setNewCase({ ...newCase, organHint: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-red-600/40 text-white"
                    >
                      <option value="lung">ปอด (Lung)</option>
                      <option value="bone">กระดูก (Bone)</option>
                      <option value="thyroid">ไทรอยด์ (Thyroid)</option>
                      <option value="liver">ตับ/ม้าม (Liver/Spleen)</option>
                      <option value="kidney">ไต (Kidney)</option>
                      <option value="heart">หัวใจ (Heart)</option>
                      <option value="brain">สมอง (Brain)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-rose-200 font-bold mb-1">คำบรรยายโจทย์ไทย (PromptTh)*</label>
                  <textarea
                    rows={2}
                    value={newCase.promptTh}
                    onChange={(e) => setNewCase({ ...newCase, promptTh: e.target.value })}
                    placeholder="ผู้ป่วยมาด้วยอาการหอบเหนื่อยเฉียบพลัน ต้องการส่งตรวจประเมิน..."
                    className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-red-600/40 text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCaseModal(false)}
                  className="flex-1 py-2 rounded-xl bg-black/40 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSaveCase}
                  className="flex-1 py-2 rounded-xl bg-[#C81E33] hover:bg-red-600 text-white font-black text-xs cursor-pointer shadow-md"
                >
                  บันทึกลงกองเล่น
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------
          MODAL: Add CLUE Card (ใบเขียว) with Leak Detection
         ---------------------------------------------------- */}
      <AnimatePresence>
        {showAddClueModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-[#0B3B36] border-2 border-emerald-500/60 rounded-3xl p-6 shadow-2xl space-y-4 my-auto">
              <div className="flex justify-between items-center border-b border-emerald-500/30 pb-3">
                <h3 className="text-base font-black font-game text-white flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#2EAD4B]" />
                  <span>เพิ่มคำใบ้ส่วนตัว (CLUE - ใบเขียว)</span>
                </h3>
                <button onClick={() => setShowAddClueModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {clueFormError && (
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs">
                  {clueFormError}
                </div>
              )}

              {clueLeakWarning && (
                <div className="p-3 rounded-xl bg-amber-950/90 border-2 border-amber-400 text-amber-200 text-xs flex items-start space-x-2 animate-bounce">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <span className="font-bold block">ไม่อนุญาตให้บันทึก:</span>
                    <span>{clueLeakWarning}</span>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-emerald-200 font-bold mb-1">รหัสคำใบ้ (ห้ามซ้ำ)*</label>
                    <input
                      type="text"
                      value={newClue.id}
                      onChange={(e) => setNewClue({ ...newClue, id: e.target.value.toUpperCase() })}
                      placeholder="T-13"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-emerald-600/40 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-200 font-bold mb-1">เป้าหมาย (Target)*</label>
                    <input
                      type="text"
                      value={newClue.target}
                      onChange={(e) => setNewClue({ ...newClue, target: e.target.value })}
                      placeholder="หลอดเลือดฝอยปอด (Capillaries)"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-emerald-600/40 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-emerald-200 font-bold mb-1">
                    ข้อความคำใบ้ (ห้ามมีชื่อสารหรือชื่อกลไก)*
                  </label>
                  <textarea
                    rows={2}
                    value={newClue.reveals}
                    onChange={(e) => {
                      setNewClue({ ...newClue, reveals: e.target.value });
                      setClueLeakWarning(null);
                    }}
                    placeholder="สารที่มีขนาดอนุภาค 10–50 μm จะติดค้างในอวัยวะนี้เป็นจุดแรก..."
                    className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-emerald-600/40 text-white"
                  />
                  <span className="text-[10px] text-emerald-300/70">
                    * ระบบจะตรวจสอบชื่อไอโซโทป สาร หรือกลไกโดยอัตโนมัติเพื่อป้องกันเฉลยรั่ว
                  </span>
                </div>

                <div>
                  <label className="block text-emerald-200 font-bold mb-1">ข้อมูลประกอบเพิ่มเติม (บรรทัดละ 1 ข้อ)</label>
                  <textarea
                    rows={2}
                    value={newClue.bodyText}
                    onChange={(e) => setNewClue({ ...newClue, bodyText: e.target.value })}
                    placeholder="ขนาดของช่องหลอดเลือดเฉลี่ย 7–10 μm"
                    className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-emerald-600/40 text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClueModal(false)}
                  className="flex-1 py-2 rounded-xl bg-black/40 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSaveClue}
                  className="flex-1 py-2 rounded-xl bg-[#2EAD4B] hover:bg-emerald-600 text-slate-950 font-black text-xs cursor-pointer shadow-md"
                >
                  บันทึกลงกองเล่น
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------
          MODAL: Student Coins & Account Management
         ---------------------------------------------------- */}
      <AnimatePresence>
        {selectedStudentForCoins && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          >
            <div className="w-full max-w-md bg-[#0B3B36] border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-amber-500/30 pb-3">
                <div>
                  <h3 className="text-base font-black font-game text-white">จัดการบัญชีนักศึกษา</h3>
                  <p className="text-xs text-amber-300/80">
                    {selectedStudentForCoins.studentId} • {selectedStudentForCoins.displayName}
                  </p>
                </div>
                <button onClick={() => setSelectedStudentForCoins(null)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {coinModalError && (
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs">
                  {coinModalError}
                </div>
              )}

              {/* Current Status */}
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/30 border border-amber-500/20 text-xs">
                <span>ยอดเหรียญปัจจุบัน:</span>
                <span className="font-mono font-black text-base text-[#E6A100]">
                  {selectedStudentForCoins.coins} เหรียญ
                </span>
              </div>

              {/* Adjust Coins Form */}
              <div className="space-y-3 text-xs">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setCoinDeltaType("add")}
                    className={`flex-1 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                      coinDeltaType === "add" ? "bg-emerald-600 text-white shadow-xs" : "bg-black/40 text-slate-400"
                    }`}
                  >
                    + บวกเหรียญ
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoinDeltaType("deduct")}
                    className={`flex-1 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                      coinDeltaType === "deduct" ? "bg-rose-700 text-white shadow-xs" : "bg-black/40 text-slate-400"
                    }`}
                  >
                    - หักเหรียญ
                  </button>
                </div>

                <div>
                  <label className="block text-amber-200 font-bold mb-1">จำนวนเหรียญ*</label>
                  <input
                    type="number"
                    min={1}
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-600/40 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-amber-200 font-bold mb-1">เหตุผลในการปรับยอด (จำเป็น)*</label>
                  <input
                    type="text"
                    value={coinReason}
                    onChange={(e) => setCoinReason(e.target.value)}
                    placeholder="เช่น รางวัลกิจกรรมในชั้นเรียน, ซื้อของรางวัลพิเศษ"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-600/40 text-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCoinModalError(null);
                    if (!coinReason.trim()) {
                      setCoinModalError("กรุณากรอกเหตุผลในการปรับยอดเหรียญ");
                      return;
                    }
                    const delta = coinDeltaType === "add" ? coinAmount : -coinAmount;
                    if (selectedStudentForCoins.coins + delta < 0) {
                      setCoinModalError("ยอดเหรียญห้ามติดลบ");
                      return;
                    }

                    const res = adminUpdateCoins(selectedStudentForCoins.studentId, delta, coinReason.trim());
                    if (!res.success) {
                      setCoinModalError(res.error || "เกิดข้อผิดพลาด");
                      return;
                    }

                    sounds.playWin();
                    setCoinReason("");
                    setSelectedStudentForCoins(null);
                    loadAllData();
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-black font-game text-xs shadow-md cursor-pointer"
                >
                  บันทึกการปรับเหรียญ
                </button>
              </div>

              {/* Action Buttons: Reset to 120 & Disable Account */}
              <div className="pt-3 border-t border-white/10 flex space-x-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`ต้องการรีเซ็ตเหรียญของ ${selectedStudentForCoins.displayName} เป็น 120 หรือไม่?`)) {
                      adminResetCoins(selectedStudentForCoins.studentId);
                      sounds.playWin();
                      setSelectedStudentForCoins(null);
                      loadAllData();
                    }
                  }}
                  className="flex-1 py-2 rounded-xl bg-amber-900/40 hover:bg-amber-800/60 border border-amber-500/40 text-amber-200 font-bold cursor-pointer"
                >
                  รีเซ็ตเป็น 120
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const res = adminToggleDisable(selectedStudentForCoins.studentId);
                    if (!res.success) {
                      alert(res.error);
                      return;
                    }
                    sounds.playClick();
                    setSelectedStudentForCoins(null);
                    loadAllData();
                  }}
                  disabled={selectedStudentForCoins.studentId.toLowerCase() === "admin"}
                  className={`flex-1 py-2 rounded-xl font-bold cursor-pointer border ${
                    selectedStudentForCoins.disabled
                      ? "bg-emerald-950/70 border-emerald-500 text-emerald-200"
                      : "bg-rose-950/70 border-rose-500 text-rose-200"
                  } ${selectedStudentForCoins.studentId.toLowerCase() === "admin" ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  {selectedStudentForCoins.disabled ? "เปิดใช้งานบัญชี" : "ปิดระงับบัญชี"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------
          MODAL: Multi-device Account Sync & JSON Backup
         ---------------------------------------------------- */}
      <AnimatePresence>
        {showSyncJsonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-[#12161f] border border-blue-500/40 rounded-3xl p-6 max-w-xl w-full text-white shadow-2xl relative">
              <button
                onClick={() => setShowSyncJsonModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-game text-white">ระบบซิงค์ข้ามอุปกรณ์ & สำรองบัญชี</h3>
                  <p className="text-xs text-blue-300/70">
                    สถานะการเชื่อมต่อ: {isSyncConnected ? "🟢 ออนไลน์ (MQTT Mesh Active)" : "🟡 กำลังเชื่อมต่อ..."}
                  </p>
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 mb-4 text-xs text-slate-300 space-y-2">
                <p>
                  ⚡ <strong className="text-white">ซิงค์อัตโนมัติ:</strong> อุปกรณ์ที่เปิดเว็บอยู่ (คอมพิวเตอร์, iPad, มือถือ) จะซิงค์รายชื่อนักศึกษาและเหรียญเข้าหากันโดยอัตโนมัติผ่านเครือข่ายเรียลไทม์
                </p>
                <p>
                  📋 <strong className="text-white">ส่งต่อทันทีด้วย JSON:</strong> หากต้องการนำเข้ารายชื่อจากเครื่องอื่น หรือสำรองข้อมูล สามารถคัดลอกหรือวางข้อความด้านล่างนี้ได้เลย
                </p>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-400">ข้อมูลบัญชีผู้เล่น ({getNaAccounts().length} บัญชีในเครื่องนี้):</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(syncJsonInput);
                      sounds.playClick();
                      setSyncJsonStatus("คัดลอก JSON สำเร็จแล้ว!");
                      setTimeout(() => setSyncJsonStatus(""), 3000);
                    }}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    คัดลอก JSON
                  </button>
                </div>
                <textarea
                  value={syncJsonInput}
                  onChange={(e) => setSyncJsonInput(e.target.value)}
                  rows={8}
                  className="w-full bg-black/60 border border-white/20 rounded-xl p-3 font-mono text-xs text-amber-200 focus:outline-none focus:border-blue-400"
                  placeholder="วาง JSON ของบัญชีที่นี่เพื่อผสานข้อมูล..."
                />
              </div>

              {syncJsonStatus && (
                <div className="mb-3 p-2.5 rounded-xl bg-blue-950/60 border border-blue-500/50 text-xs text-blue-200 font-bold text-center">
                  {syncJsonStatus}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    try {
                      const parsed = JSON.parse(syncJsonInput);
                      if (!Array.isArray(parsed)) {
                        setSyncJsonStatus("รูปแบบ JSON ไม่ถูกต้อง (ต้องเป็น Array ของบัญชี)");
                        return;
                      }
                      const current = getNaAccounts();
                      const { merged, hasChanges } = mergeAccountLists(current, parsed);
                      saveNaAccounts(merged, false);
                      broadcastAllAccounts();
                      setStudents(merged);
                      setStudentsLoadedAt(new Date());
                      sounds.playWin();
                      setSyncJsonStatus(`ผสานข้อมูลสำเร็จ! มีทั้งหมด ${merged.length} บัญชี (และส่งซิงค์ไปยังอุปกรณ์อื่นแล้ว)`);
                    } catch (err: any) {
                      setSyncJsonStatus("เกิดข้อผิดพลาดในการอ่าน JSON: " + err.message);
                    }
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-xs text-white shadow-lg cursor-pointer"
                >
                  ผสานและนำเข้าบัญชีจาก JSON
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    broadcastAllAccounts();
                    requestAccountsSync();
                    setSyncJsonStatus("ส่งคำขอซิงค์ไปยังทุกอุปกรณ์ที่เปิดอยู่แล้ว!");
                    setTimeout(() => setSyncJsonStatus(""), 3000);
                  }}
                  className="px-4 py-2.5 bg-emerald-700/60 hover:bg-emerald-600/70 border border-emerald-500/50 rounded-xl font-bold text-xs text-emerald-200 cursor-pointer"
                >
                  📡 ยิงซิงค์ทุกอุปกรณ์เดี๋ยวนี้
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------
          MODAL: แก้ไขการ์ด (EDIT CARD MODAL - ALL DECKS)
         ---------------------------------------------------- */}
      <AnimatePresence>
        {editingCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-5xl bg-[#0B3B36] border-2 border-amber-500/70 rounded-3xl p-5 sm:p-6 shadow-2xl text-amber-100 my-6 max-h-[92vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-600/30">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-900/60 border border-blue-400/50 flex items-center justify-center text-blue-300">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black font-game text-white flex items-center space-x-2">
                      <span>แก้ไขการ์ด {editingCard.card.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        editingCard.type === "RP" ? "bg-blue-950 text-blue-300 border border-blue-600/40" :
                        editingCard.type === "MECH" ? "bg-amber-950 text-amber-300 border border-amber-600/40" :
                        editingCard.type === "CASE" ? "bg-red-950 text-rose-300 border border-red-600/40" :
                        "bg-emerald-950 text-emerald-300 border border-emerald-600/40"
                      }`}>
                        {editingCard.type}
                      </span>
                    </h3>
                    <p className="text-[11px] text-amber-300/70">
                      ปรับปรุงข้อความ รายละเอียด และรูปภาพประกอบของการ์ดจริง (อัปเดตแบบเรียลไทม์)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingCard(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto pr-1">
                {editCardError && (
                  <div className="p-2.5 mb-4 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{editCardError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Live Rendered Card Preview */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-start space-y-3 bg-black/40 p-4 rounded-2xl border border-amber-500/30 lg:sticky lg:top-0">
                    <div className="flex items-center justify-between w-full border-b border-amber-500/20 pb-2">
                      <div className="flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span className="text-xs font-bold text-amber-300">ตัวอย่างการ์ดจริง (Live Preview)</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                        {editingCard.type}
                      </span>
                    </div>

                    <div className="flex justify-center items-center py-2 w-full">
                      {previewCard && editingCard.type === "RP" && (
                        <RpCard card={previewCard as RadiopharmaceuticalCard} size="sm" isHoverable={false} />
                      )}
                      {previewCard && editingCard.type === "MECH" && (
                        <MechCard card={previewCard as MechanismCard} size="sm" isHoverable={false} />
                      )}
                      {previewCard && editingCard.type === "CASE" && (
                        <CaseCardComponent card={previewCard as CaseCard} size="sm" isHoverable={false} />
                      )}
                      {previewCard && editingCard.type === "CLUE" && (
                        <ClueCardComponent card={previewCard as ClueCard} size="sm" isHoverable={false} />
                      )}
                    </div>

                    <div className="text-[11px] text-amber-200/90 leading-relaxed bg-black/50 p-2.5 rounded-xl border border-amber-500/20 w-full text-center">
                      🌟 <strong>การ์ดจริงที่แสดงในเกม:</strong> เมื่อแก้ไขข้อความ รูปภาพ หรือข้อมูล ค่าทั้งหมดจะอัปเดตลงในการ์ดจริงทันที ทั้งในคลังและตอนนักเรียนเล่น
                    </div>
                  </div>

                  {/* Right Column: Form Inputs */}
                  <div className="lg:col-span-7 space-y-4 text-xs">
                    {/* 1. Image Editor Box */}
                <div className="p-3.5 bg-black/40 rounded-2xl border border-amber-600/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-amber-200 flex items-center space-x-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>รูปภาพประกอบการ์ด (Card Image / Art)</span>
                    </label>
                    {editCardForm.artUrl && (
                      <button
                        type="button"
                        onClick={() => setEditCardForm((prev: any) => ({ ...prev, artUrl: "" }))}
                        className="text-[10px] text-rose-300 hover:text-rose-200 underline cursor-pointer"
                      >
                        ล้างรูปภาพ (กลับไปใช้ภาพมาตรฐาน)
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Thumbnail Preview */}
                    <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-slate-900 border-2 border-dashed border-amber-500/40 flex items-center justify-center overflow-hidden shrink-0">
                      {editCardForm.artUrl ? (
                        <img
                          src={editCardForm.artUrl}
                          alt="Card Preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center p-2 text-slate-500">
                          <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                          <span className="text-[9px]">ภาพไอคอนเริ่มต้น</span>
                        </div>
                      )}
                    </div>

                    {/* Inputs for Image URL and Upload */}
                    <div className="flex-1 w-full space-y-2">
                      <div>
                        <label className="text-[10px] text-amber-300/80 mb-0.5 block">
                          ใส่ลิงก์รูปภาพ (Image URL - HTTP/HTTPS หรือ Path):
                        </label>
                        <input
                          type="text"
                          value={editCardForm.artUrl || ""}
                          onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, artUrl: e.target.value }))}
                          placeholder="https://example.com/image.png หรือ /illustrations/..."
                          className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-900/40 hover:bg-amber-800/60 border border-amber-500/40 text-amber-200 cursor-pointer transition-colors text-[11px] font-bold">
                          <Upload className="w-3.5 h-3.5" />
                          <span>อัปโหลดรูปจากเครื่อง (PNG, JPG, WebP)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-[9.5px] text-slate-400">
                        * รองรับทั้งการอัปโหลดไฟล์จากเครื่อง (Desktop / iPad) และการใส่ลิงก์ URL
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Common Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-amber-200 font-bold mb-1">
                      ชื่อภาษาไทย (Title TH)*
                    </label>
                    <input
                      type="text"
                      value={editCardForm.titleTh || ""}
                      onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, titleTh: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-200 font-bold mb-1">
                      ชื่อภาษาอังกฤษ (Title EN)*
                    </label>
                    <input
                      type="text"
                      value={editCardForm.titleEn || ""}
                      onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, titleEn: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-amber-200 font-bold mb-1">
                    คำบรรยายย่อย / ชื่อเล่น (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={editCardForm.subtitle || ""}
                    onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="เช่น (F-18 FDG) หรือ ฟังก์ชันไต..."
                    className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* 3. Type-Specific Form Fields */}
                {editingCard.type === "RP" && (
                  <div className="p-3 bg-black/25 rounded-2xl border border-blue-500/30 space-y-3">
                    <div className="font-bold text-blue-300 text-xs">ข้อมูลเฉพาะสารเภสัชรังสี (RP)</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-slate-300 mb-0.5">ไอโซโทป (Nuclide)</label>
                        <input
                          type="text"
                          value={editCardForm.nuclide || ""}
                          onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, nuclide: e.target.value }))}
                          className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-0.5">เครื่องตรวจ (Modality)</label>
                        <select
                          value={editCardForm.modality || "SPECT"}
                          onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, modality: e.target.value }))}
                          className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-white/20 text-white"
                        >
                          <option value="SPECT">SPECT</option>
                          <option value="PET">PET</option>
                          <option value="BOTH">BOTH</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-0.5">กลไกหลัก (Mechanism)</label>
                        <select
                          value={editCardForm.mechanismId || "M-01"}
                          onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, mechanismId: e.target.value }))}
                          className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-white/20 text-white"
                        >
                          {mechCards.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.id}: {m.titleEn}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 mb-0.5">เป้าหมาย (Target)</label>
                        <input
                          type="text"
                          value={editCardForm.target || ""}
                          onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, target: e.target.value }))}
                          className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-0.5">การขนส่ง (Transporter)</label>
                        <input
                          type="text"
                          value={editCardForm.transporter || ""}
                          onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, transporter: e.target.value }))}
                          className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-white/20 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-0.5">การประยุกต์ใช้ (Clinical Application)</label>
                      <input
                        type="text"
                        value={editCardForm.application || ""}
                        onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, application: e.target.value }))}
                        className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-white/20 text-white"
                      />
                    </div>
                  </div>
                )}

                {editingCard.type === "MECH" && (
                  <div className="p-3 bg-black/25 rounded-2xl border border-amber-500/30 space-y-2">
                    <div className="font-bold text-amber-300 text-xs">ข้อมูลกลไก (Mechanism Details)</div>
                    <div>
                      <label className="block text-slate-300 mb-0.5">หมายเหตุทางฟิสิกส์ (Physics Note)</label>
                      <input
                        type="text"
                        value={editCardForm.physicsNote || ""}
                        onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, physicsNote: e.target.value }))}
                        className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-white/20 text-white"
                      />
                    </div>
                  </div>
                )}

                {editingCard.type === "CASE" && (
                  <div className="p-3 bg-black/25 rounded-2xl border border-red-500/30 space-y-3">
                    <div className="font-bold text-rose-300 text-xs">ข้อมูลโจทย์เคส (Case Details)</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-slate-300 mb-0.5">ระดับความยาก</label>
                        <select
                          value={editCardForm.difficulty || "BASIC"}
                          onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, difficulty: e.target.value }))}
                          className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-white/20 text-white"
                        >
                          <option value="BASIC">BASIC</option>
                          <option value="CLINICAL">CLINICAL</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-0.5">คะแนนโจทย์</label>
                        <select
                          value={editCardForm.points || 2}
                          onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, points: Number(e.target.value) }))}
                          className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-white/20 text-white"
                        >
                          <option value={2}>2 คะแนน</option>
                          <option value={4}>4 คะแนน</option>
                          <option value={8}>8 คะแนน</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-0.5">อวัยวะ (Organ Hint)</label>
                        <input
                          type="text"
                          value={editCardForm.organHint || ""}
                          onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, organHint: e.target.value }))}
                          placeholder="lung, thyroid, bone..."
                          className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-white/20 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-0.5">คำถามโจทย์ภาษาไทย (Prompt TH)*</label>
                      <textarea
                        rows={2}
                        value={editCardForm.promptTh || ""}
                        onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, promptTh: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-0.5">คำอธิบายเฉลยทางคลินิก (Explanation TH)</label>
                      <textarea
                        rows={2}
                        value={editCardForm.explanationTh || ""}
                        onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, explanationTh: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-0.5">คำใบ้ที่จับคู่ (Clue ID)</label>
                      <select
                        value={editCardForm.clueId || ""}
                        onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, clueId: e.target.value }))}
                        className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-white/20 text-white"
                      >
                        <option value="">-- ไม่ระบุคำใบ้ --</option>
                        {clueCards.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.id}: {c.titleTh} ({c.reveals})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {editingCard.type === "CLUE" && (
                  <div className="p-3 bg-black/25 rounded-2xl border border-emerald-500/30 space-y-2">
                    <div className="font-bold text-emerald-300 text-xs">ข้อมูลคำใบ้ (Clue Details)</div>
                    <div>
                      <label className="block text-slate-300 mb-0.5">ประเภทคำใบ้ (Kind)</label>
                      <select
                        value={editCardForm.clueKind || "TARGET"}
                        onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, clueKind: e.target.value }))}
                        className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-white/20 text-white"
                      >
                        <option value="TARGET">TARGET</option>
                        <option value="WHY">WHY</option>
                        <option value="TRAIT">TRAIT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-0.5">เนื้อหาคำใบ้ที่เฉลย (Reveals)*</label>
                      <textarea
                        rows={2}
                        value={editCardForm.reveals || ""}
                        onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, reveals: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 text-white"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Body bullet points */}
                <div>
                  <label className="block text-amber-200 font-bold mb-1">
                    หัวข้อย่อย / รายละเอียด (1 บรรทัดต่อ 1 ข้อความ)
                  </label>
                  <textarea
                    rows={3}
                    value={editCardForm.bodyStr || ""}
                    onChange={(e) => setEditCardForm((prev: any) => ({ ...prev, bodyStr: e.target.value }))}
                    placeholder="ใส่ข้อมูลย่อยบรรทัดละ 1 ข้อ..."
                    className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-amber-500/30 text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-amber-600/30">
                <button
                  type="button"
                  onClick={() => handleDeleteCard(editingCard.type, editingCard.card.id)}
                  className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-200 font-bold text-xs flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ลบการ์ด</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingCard(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEditCard}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg cursor-pointer transition-all active:scale-95 flex items-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>บันทึกการแก้ไข</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
