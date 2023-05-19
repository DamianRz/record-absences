import { Button, Checkbox, Dialog, DialogActions, DialogTitle, FormControl, FormLabel, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { TURNS } from "../constants/absences";
import { GRADES } from "../utils/groups";
import { MenuProps } from "../constants/styles";
import { LoaderContext } from "../contexts/loader";
import { getFilteredMGs } from "../utils/mg";
import { getGMP } from "../libs/gmpsApi";
import { GROUPS_HEADERS, IGmp, SELECTED_GMP } from "../constants/teachers";
import CustomTable from "./table";

interface GroupsAssignerProps {
    formData: any,
    onSelectMatterAndGroup: any,
    onChangeGMPState: any,
    onChangeField: (event: any) => void
}

export const GroupsAssigner: React.FC<GroupsAssignerProps> = ({
    formData: { turnId, selectedGrade, matterSpecialtyIds, gmps: gmpsBase },
    onChangeGMPState,
    onSelectMatterAndGroup,
    onChangeField
}) => {
    const [gmps, setGmps] = useState<any[]>(JSON.parse(JSON.stringify(gmpsBase)));
    const { isLoading, setLoading } = useContext(LoaderContext);
    const [selectedGmp, setSelectedGmp] = useState<IGmp>(SELECTED_GMP);
    const [showConfirmChangeState, setShowConfirmChangeState] = useState(false);
    const [availableMGs, setAvailableMGs] = useState([])
    const [selectedGroupsNames, setSelectedGroupsNames] = useState<string[]>([])
    const [selectedMGIds, setSelectedMGIds] = useState<number[]>([])

    const [errors, setErrors] = useState({
        error: "",
        errorFilters: false,
        errorSave: false
    });

    useEffect(() => {
        onSelectMatterAndGroup(selectedMGIds)
    }, [selectedMGIds])

    useEffect(() => {
        onChangeGMPState(formatGMPbyHeaders(gmps).filter((gmp: any) => gmp.updated == true))
    }, [gmps])

    const searchGroupsByFilters = async () => {
        setLoading(true)
        setErrors({ ...errors, errorFilters: false })
        let MGList: any = []
        await Promise.all(
            matterSpecialtyIds.map(async (id: number) => {
                const mgFilters = {
                    "matterId": id,
                    "group": {
                        "grade": selectedGrade,
                        "turnId": turnId,
                        "active": true
                    }
                }
                const MGs = await getFilteredMGs(mgFilters)
                let mgsFilteredByGMPs: any = []
                await Promise.all(
                    MGs.map(async (mg: any) => {
                        const filter = { mgId: mg.id, active: true }
                        const exists: any = await getGMP(null, filter)
                        if (!exists.length) {
                            mgsFilteredByGMPs.push(mg)
                        }
                    })
                )
                const filteredNotSavedInGmps = mgsFilteredByGMPs.filter((a: any) => {
                    let found = true;
                    gmps.map((b: any) => {
                        if (b.group.id === a.group.id) found = false
                    })
                    return found
                })

                MGList = [...MGList, ...filteredNotSavedInGmps]
            })
        )
        setAvailableMGs(MGList)
        setSelectedGroupsNames([])
        setSelectedMGIds([])
        if (MGList.length === 0) setErrors({ ...errors, errorFilters: true })
        setLoading(false)
    }

    const handleGroupsChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setSelectedGroupsNames(typeof value === "string" ? value.split(",") : value)
    };

    const handleSelectGroup = (mg: any) => {
        if (selectedGroupsNames.indexOf(`${mg.group.name}-${mg.matter.name}`) === -1) {
            setSelectedMGIds(prev => [...prev, mg.id])
            setSelectedGroupsNames(prev => [...prev, `${mg.group.name}-${mg.matter.name}`])
        } else {
            const filteredNames = selectedGroupsNames.filter(
                (name: string) => name !== `${mg.group.name}-${mg.matter.name}`
            );
            const filteredIds = selectedMGIds.filter(
                (id: number) => id !== mg.id
            );
            setSelectedMGIds(filteredIds)
            setSelectedGroupsNames(filteredNames)
        }
    };

    const formatGMPbyHeaders = (gmps: any) => {
        const formatted = gmps.map((gmp: any) => {
            return gmp.matters.map((matter: any) => ({
                id: gmp.group.id,
                gmpId: matter.gmpId,
                matterName: matter.name,
                groupName: gmp.group.name,
                turnName: TURNS[gmp.group.turnId - 1].name,
                grade: gmp.group.grade,
                activeLabel: matter.active ? "ACTIVO" : "INACTIVO",
                active: Boolean(matter.active),
                updated: matter.updated
            }))
        })
        if (formatted.length) {
            return formatted[0].sort((a: any, b: any) => a.id - b.id)
        }
        return []
    }

    const changeSateSelectedGmp = async () => {
        const modifiedGmps = gmps.map((item: any) => {
            if (item.matters.some((matter: any) => matter.gmpId === selectedGmp.gmpId)) {
                const modifiedItem = { ...item };
                modifiedItem.matters = modifiedItem.matters.map((matter: any) => {
                    if (matter.gmpId === selectedGmp.gmpId) {
                        return {
                            ...matter,
                            updated: !matter.updated,
                            active: !selectedGmp.active,
                        };
                    }
                    return matter;
                });
                return modifiedItem;
            }
            return item;
        });
        setGmps(modifiedGmps);
        setShowConfirmChangeState(false);
    };

    return (
        <>
            <p className="my-2 text-sm">Asignar grupos</p>
            <div className="flex space-x-2">
                <FormControl sx={{ minWidth: "150px" }}>
                    <InputLabel id="turn-select">Turno</InputLabel>
                    <Select
                        name="turnId"
                        labelId="turn-select"
                        value={turnId}
                        onChange={onChangeField}
                        input={<OutlinedInput label="Turno" />}
                    >
                        {TURNS.map((turn) => (
                            <MenuItem key={turn.id} value={turn.id}>
                                {turn.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl className="w-full">
                    <InputLabel id="select-grade">Grado</InputLabel>
                    <Select
                        name="selectedGrade"
                        labelId="select-grade"
                        value={selectedGrade}
                        onChange={onChangeField}
                        input={<OutlinedInput label="Grado" />}
                        MenuProps={MenuProps}
                    >
                        {GRADES.map((grade: number, index: number) => (
                            <MenuItem
                                key={index}
                                value={grade}
                            >
                                {`${grade}º`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    onClick={() => searchGroupsByFilters()}
                    className="w-full mx-4 normal-case"
                    disabled={!(turnId && selectedGrade && matterSpecialtyIds) && isLoading}
                >
                    Filtrar Grupos
                </Button>
            </div>
            {(availableMGs.length > 0) && (
                <div className="flex w-full mt-4 mb-4 space-x-2">
                    <FormControl className="w-full min-w-[350px]">
                        <InputLabel id="groups-select">Seleccione Grupos</InputLabel>
                        <Select
                            labelId="groups-select"
                            multiple
                            value={selectedGroupsNames}
                            onChange={handleGroupsChange}
                            input={<OutlinedInput label="Seleccione Grupos" />}
                            renderValue={(selected) => selected.join(", ")}
                            MenuProps={MenuProps}
                        >
                            {availableMGs.map((mg: any, index: number) => (
                                <MenuItem
                                    className="h-[20px]"
                                    key={index}
                                    value={`${mg.group.name}-${mg.matter.name}`}
                                    onClick={() => {
                                        handleSelectGroup(mg);
                                    }}
                                >
                                    <Checkbox
                                        checked={
                                            selectedGroupsNames.indexOf(`${mg.group.name}-${mg.matter.name}`) > -1
                                        }
                                    />
                                    <ListItemText primary={`${mg.group.name}-${mg.matter.name}`} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            )}
            {errors.errorFilters && (
                <p className="mb-4 text-red-400">No se han encontrado grupos con los filtros seleccionados</p>
            )}
            <p className="my-4 text-sm">Grupos Asignados</p>
            {
                formatGMPbyHeaders(gmps).length ? (
                    <CustomTable
                        className="max-h-[160px]"
                        headers={GROUPS_HEADERS}
                        items={formatGMPbyHeaders(gmps)}
                        onSelectRow={(row: any) => {
                            setSelectedGmp(row)
                            setShowConfirmChangeState(true)
                        }}
                    />
                ) : (<p className="mb-4 text-center">No tiene grupos asignados</p>)
            }
            <Dialog open={showConfirmChangeState} className="max-w-xl mx-auto">
                <DialogTitle className="text-sm">
                    {selectedGmp.active ? "Esta seguro de que desea DESACTIVAR esta asignacion de grupo?" : "Esta seguro de que desea ACTIVAR esta asignacion de grupo?"}
                </DialogTitle>
                <DialogActions className="pb-4 pr-4 space-x-4">
                    <Button
                        onClick={() => setShowConfirmChangeState(false)}
                        variant="outlined"
                        size="small"
                        className="normal-case"
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="warning"
                        variant="outlined"
                        size="small"
                        className="normal-case"
                        onClick={() => changeSateSelectedGmp()}
                        disabled={isLoading}
                    >
                        {`Si, deseo ${selectedGmp.active ? "DESACTIVAR" : "ACTIVAR"}`}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}